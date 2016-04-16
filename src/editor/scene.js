import engine from 'engine/core';
import Scene from 'engine/scene';
import Renderer from 'engine/renderer';
import PIXI from 'engine/pixi';
import Timer from 'engine/timer';
import EventEmitter from 'engine/eventemitter3';
import R from 'engine/reactive';
import Vector from 'engine/vector';
import loader from 'engine/loader';

import Mousetrap from './mousetrap';

import AssetsPanel from './components/assets-panel';

import editor from './editor';

import { models } from 'editor/model';

const SELECT_BOUND_THICKNESS = 1;

class Editor extends Scene {
  constructor() {
    super();

    // States
    this.events = new EventEmitter();

    this.operate = null;

    this.prevSelected;
    this.prevChildren;
    this.prevObjects;

    this.instMap = {};
    this.selectedInst = null;

    // Layers
    this.bgLayer = new PIXI.Container().addTo(this.stage);
    this.objLayer = new PIXI.Container().addTo(this.stage);
    this.uiLayer = new PIXI.Container().addTo(this.stage);

    // UI elements
    this.selectRect = new PIXI.Graphics().addTo(this.uiLayer);
    this.selectRect.visible = false;

    this.assetsPanel = null;

    // Create sidebar
    editor(document.getElementById('container'), (operate) => {
      this.operate = operate;
      this.assetsPanel = new AssetsPanel(this, this.uiLayer, this.operate);

      return (model) => {
        this.updateView(model);
      };
    });

    // Bind shortcuts
    Mousetrap.bind('esc', () => this.events.emit('esc'));
    Mousetrap.bind('enter', () => this.events.emit('enter'));
    Mousetrap.bind('meta+z', () => this.events.emit('undo'));
    Mousetrap.bind('meta+shift+z', () => this.events.emit('redo'));
    Mousetrap.bind('shift+a', () => this.events.emit('add'));
    Mousetrap.bind('g', () => this.events.emit('transform', 'g'));
    Mousetrap.bind('r', () => this.events.emit('transform', 'r'));
    Mousetrap.bind('s', () => this.events.emit('transform', 's'));

    // Event streams
    this.add$ = R.fromEvents(this.events, 'add');

    let esc$ = R.fromEvents(this.events, 'esc');
    let enter$ = R.fromEvents(this.events, 'enter');

    this.stage.interactive = true;
    this.stage.containsPoint = () => true;
    let mousemove$ = R.fromEvents(this.stage, 'mousemove');
    let mousedown$ = R.fromEvents(engine.view, 'mousedown');

    // Un-focus inputs when click on the mousedown
    mousedown$.onValue(() => {
      if (document.activeElement.tagName === 'INPUT') {
        document.activeElement.blur();
      }
    });

    // Undo/Redo
    R.fromEvents(this.events, 'undo')
      .onValue(() => {
        // this.model.rewind();
      });


    // Transform
    let transform$ = R.fromEvents(this.events, 'transform');

    let isTransformingSrc$ = R.pool();

    let isTransforming$ = isTransformingSrc$.toProperty(() => false);
    let notTransforming$ = isTransforming$.map(t => !t);

    // Start a new transform operation, keeps the transform "type"
    let start2Transform$ = transform$
      .filter(() => !!this.selectedInst)
      .filterBy(notTransforming$);

    // Transform type flags
    let isTranslating$ = start2Transform$.map(t => t === 'g');
    let isRotating$ = start2Transform$.map(t => t === 'r');
    let isScaling$ = start2Transform$.map(t => t === 's');

    let start2Translate$ = isTranslating$.filter();
    let start2Rotate$ = isRotating$.filter();
    let start2Scale$ = isScaling$.filter();

    let confirmTransform$ = start2Transform$
      .flatMapLatest(() => R.merge([mousedown$, enter$]));
    let cancelTransform$ = start2Transform$
      .flatMapLatest(() => esc$);

    let confirmOrCancelMove$ = R.merge([
      confirmTransform$,
      cancelTransform$,
    ]);

    let endTransform$ = start2Transform$
      .flatMapLatest(() => confirmOrCancelMove$);

    isTransformingSrc$.plug(start2Transform$.map(() => true));
    isTransformingSrc$.plug(endTransform$.map(() => false));

    this.clickObject$ = R.fromEvents(this.events, 'clickObject')
      .filterBy(notTransforming$);

    // Show and hide selecting rectangle
    start2Transform$.onValue(() => {
      // Hide select rect while moving
      // TODO: change rect color and sync with target instead
      this.selectRect.visible = false;
    });
    endTransform$.onValue(() => {
      // Update and show select rect
      this.updateRectOf(this.model.context.selected);
      this.selectRect.visible = true;
    });


    // Translate ------------------------------------------------

    const data2Pos = (d) => d.data.global.clone();
    const posDiff = (p, n) => n.clone().subtract(p);

    // Movement delta from last move event
    const translateDelta$ = start2Translate$.flatMap(() => {
      const startPos = Renderer.instance.plugins.interaction.eventData.data.global.clone();
      return mousemove$.takeUntilBy(endTransform$)
        .map(data2Pos)
        .diff(posDiff, startPos);
    });

    translateDelta$.onValue((move) => {
      this.selectedInst.position.add(move);
    });
    // Confirm translate
    confirmTransform$
      .filterBy(isTranslating$)
      .onValue(() => {
        let inst = this.instMap[this.prevSelected];

        // TODO: Group update
        this.operate('object.UPDATE', ['x', inst.position.x]);
        this.operate('object.UPDATE', ['y', inst.position.y]);
      });
    // Cancle translate
    cancelTransform$
      .filterBy(isTranslating$)
      .onValue(() => {
        let id = this.prevSelected;

        let model = this.model.data.objects[id];
        let inst = this.instMap[id];

        models[model.type].updateInst(model, inst);
      });

    // Rotate ------------------------------------------------

    const PI2 = Math.PI * 2;
    const rotation$ = start2Rotate$.flatMap(() => {
      const startPos = Vector.create(Renderer.instance.plugins.interaction.eventData.data.global.x,
        Renderer.instance.plugins.interaction.eventData.data.global.y);
      const startMouseRot = startPos.angle(this.selectedInst.position);
      const startInstRot = this.selectedInst.rotation;

      return mousemove$.takeUntilBy(endTransform$)
        .map(data2Pos)
        .map(pos => (pos.angle(this.selectedInst.position) - startMouseRot + startInstRot) % PI2);
    });

    rotation$.onValue((rot) => {
      this.selectedInst.rotation = rot;
    });
    // Confirm rotate
    confirmTransform$
      .filterBy(isRotating$)
      .onValue(() => {
        let inst = this.instMap[this.prevSelected];

        this.operate('object.UPDATE', ['rotation', inst.rotation]);
      });
    // Cancle rotate
    cancelTransform$
      .filterBy(isRotating$)
      .onValue(() => {
        let id = this.prevSelected;

        let model = this.model.data.objects[id];
        let inst = this.instMap[id];

        models[model.type].updateInst(model, inst);
      });

    // Scale ------------------------------------------------

    const scale$ = start2Scale$.flatMap(() => {
      const startPos = Vector.create(Renderer.instance.plugins.interaction.eventData.data.global.x,
        Renderer.instance.plugins.interaction.eventData.data.global.y);
      const startDist = startPos.distance(this.selectedInst.position);
      const startScale = this.selectedInst.scale.clone();

      const scaleVec = startScale.clone();
      return mousemove$.takeUntilBy(endTransform$)
        .map(data2Pos)
        .map(pos => pos.distance(this.selectedInst.position) - startDist)
        .map(distDelta => distDelta / startDist)
        .map(scaleDelta => scaleVec.copy(startScale).add(scaleDelta));
    });

    scale$.onValue((scale) => {
      this.selectedInst.scale.copy(scale);
    });
    // Confirm scale
    confirmTransform$
      .filterBy(isScaling$)
      .onValue(() => {
        let inst = this.instMap[this.prevSelected];

        // TODO: group operation
        this.operate('object.UPDATE', ['scaleX', inst.scale.x]);
        this.operate('object.UPDATE', ['scaleY', inst.scale.y]);
      });
    // Cancle scale
    cancelTransform$
      .filterBy(isRotating$)
      .onValue(() => {
        let id = this.prevSelected;

        let model = this.model.data.objects[id];
        let inst = this.instMap[id];

        models[model.type].updateInst(model, inst);
      });



    // Actions
    const insertSprite = (key) => {
      console.log(`insertSprite: ${key}`);
      this.operate('object.ADD', {
        type: 'sprite',
        x: 0, y: 0,
        texture: key,
      });
    };

    // Event handlers
    this.handlers = {
      select: (id) => this.operate('object.SELECT', id),
      add: () => this.operate('ui.SHOW_ASSETS', insertSprite),
    };
  }
  awake() {
    // Plug event handlers
    this.clickObject$
      .onValue(this.handlers.select);
    this.add$
      .onValue(this.handlers.add);

    // Tests
    setTimeout(() => {
      this.operate('object.ADD', {
        type: 'text',
        name: 'info_text',
        x: 40,
        y: 200,
        font: 'bold 64px Arial',
        fill: 'white',
        text: 'It Works!',
      });
      // this.operate('object.SELECT', 0);
    }, 100);
  }
  freeze() {
    // Remove shortcut handlers
    Mousetrap.unbind('esc');
    Mousetrap.unbind('shift+a');
    Mousetrap.unbind('g');
    Mousetrap.unbind('r');
    Mousetrap.unbind('s');

    // Unplug event handlers
    this.clickObject$
      .offValue(this.handlers.select);
    this.add$
      .offValue(this.handlers.add);
  }

  updateView(model) {
    if (this.model === model) return;

    // Save new model state
    this.model = model;

    // Objects are changed
    if (this.prevObjects !== model.data.objects) {
      this.prevObjects = model.data.objects;

      // Update instances
      for (let k in model.data.objects) {
        this.updateInstance(k, model.data.objects[k]);
      }
      // Remove non-exist instances
      for (let k in this.instMap) {
        if (!model.data.objects.hasOwnProperty(k)) {
          this.instMap[k].remove();
          delete this.instMap[k];
        }
      }
    }

    if (this.prevChildren !== model.data.children) {
      this.prevChildren = model.data.children;

      // TODO: update hierarchy
    }

    // Update select display
    this.prevSelected = model.context.selected;
    Timer.later(40, () => {
      this.select(model.context.selected);
    });
  }
  updateInstance(id, state) {
    let inst = this.instMap[id];

    // Update exist instances
    if (inst) {
      models[state.type].updateInst(state, inst);
    }
    // Create new instances
    else {
      inst = models[state.type].createInst(state).addTo(this.objLayer);
      this.instMap[id] = inst;

      // TODO: only enable this on selectable objects
      if (state.type !== 'container') {
        this.enableClickSelect(inst);
      }
    }
  }

  // APIs
  add(objModel) {
    this.instMap[objModel.id] = models[objModel.type].createInst(objModel);
  }
  remove(id) {
    this.instMap[id].remove();
    this.instMap[id] = null;
  }
  get(id) {
    return this.instMap[id];
  }
  changeParent(id, newParentId) {
    let target = this.instMap[id];
    let parent = newParentId < 0 ? this.objLayer : this.instMap[newParentId]

    parent.addChild(target);
  }
  select(id) {
    if (id === -1) return;

    this.selectedInst = this.instMap[id];
    this.updateRectOf(id);
  }
  updateRectOf(id) {
    let target = this.instMap[id];
    let bounds = target.getLocalBounds();
    let g = this.selectRect;

    g.clear();
    g.lineStyle(SELECT_BOUND_THICKNESS, 0x39bdfd);
    g.drawRect(
      bounds.x - target.pivot.x - SELECT_BOUND_THICKNESS * 0.5,
      bounds.y - target.pivot.y - SELECT_BOUND_THICKNESS * 0.5,
      bounds.width * target.scale.x + SELECT_BOUND_THICKNESS,
      bounds.height * target.scale.y + SELECT_BOUND_THICKNESS
    );
    g.position.copy(target.position);
    g.rotation = target.rotation;

    g.visible = true;
  }

  // Helpers
  enableClickSelect(obj) {
    obj.interactive = true;
    obj.on('mousedown', (e) => {
      this.events.emit('clickObject', obj.id);
      e.stopPropagation();
    });
  }
};
engine.addScene('Editor', Editor);
