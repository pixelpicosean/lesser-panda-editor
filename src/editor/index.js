import Renderer from 'engine/renderer';
import config from 'game/config';
config.resizeMode = 'crop';

import R from 'engine/reactive';
import EventEmitter from 'engine/eventemitter3';
import Vector from 'engine/vector';
import { removeItems } from 'engine/utils';

import snabbdom from 'snabbdom';
const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/attributes'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
]);
import h from 'snabbdom/h';

import Split from 'editor/split';

import css from './style.css';

// Model
import context from './context';
import data from './data';

// Operators
import ops from './ops';
import './ops/object';

// Components
import outliner from './components/outliner';
import inspector from './components/inspector';

const init = (view2d) => {
  let model = {
    context: context(),
    data: data(),
    view2d: view2d,

    // Undo support
    rewindIdx: 0, // [... 3, 2, 1] 0(current)
    rewindQueue: [],

    rewind: () => {
      if (model.rewindIdx < model.rewindQueue.length - 1) {
        model.rewindIdx += 1;

        let act = model.rewindQueue[model.rewindQueue.length - model.rewindIdx];
        act.action(model, act.param);
      }
      else {
        console.log('[Dev] can not rewind any more');
      }
    },
  };

  view2d.model = model;

  return model;
};

// Operation dispatcher
let emitter;
const index = (o, i) => (o ? o[i] : undefined);
const operate = (actStr, param) => {
  let operator = actStr.split('.').reduce(index, ops);
  if (operator) {
    emitter.emit({ operator, param });
  }
  else {
    emitter.error(`WARNING: operator "${actStr}" not found`);
  }
};

// Action stream
const actions$ = R.stream(e => emitter = e);

// Editor factory
const editor = (elm, view2d) => {

  // Editor view
  const view = (model) => h(`section.${css.sidebar}`, {
    hook: {
      key: 'sidebar',
      insert: (vnode) => {
        if (vnode.elm.hasChildNodes()) {
          Split(Array.prototype.slice.call(vnode.elm.childNodes), {
            direction: 'vertical',
            minSize: 20,
          });
        }
      },
    },
  }, [
    outliner(model, operate),
    inspector(model, operate),
  ]);

  // Logic stream
  actions$
    // Update
    .scan((model, act) => {
      let rewindData = act.operator.execute(model, act.param);
      // The operation can be undo
      if (act.operator.rewindable) {
        // Delete undo histories that cannot be reached any more
        if (model.rewindIdx > 0) {
          removeItems(model.rewindQueue, model.rewindQueue.length - model.rewindIdx + 1);
        }
        // Reset rewind index to default
        model.rewindIdx = 0;
        // Add a new rewind item to the history
        model.rewindQueue.push({
          action: act.operator.rewind,
          param: rewindData,
        });
      }
      return model;
    }, init(view2d))
    // View
    .map(view)
    // Apply to editor element
    .scan(patch, elm)
    // Logging
    .onError(err => console.log(err));

};

// Editor scene
import engine from 'engine/core';
import Scene from 'engine/scene';
import PIXI from 'engine/pixi';
import Timer from 'engine/timer';
import loader from 'engine/loader';

import Mousetrap from './mousetrap';

import AssetsPanel from './components/assets-panel';

const SELECT_BOUND_THICKNESS = 1;

class Editor extends Scene {
  constructor() {
    super();

    // States
    this.events = new EventEmitter();
    this.model = null;

    this.instMap = {};
    this.selectedInst = null;

    // Layers
    this.bgLayer = new PIXI.Container().addTo(this.stage);
    this.objLayer = new PIXI.Container().addTo(this.stage);
    this.uiLayer = new PIXI.Container().addTo(this.stage);

    // UI elements
    this.selectRect = new PIXI.Graphics().addTo(this.uiLayer);
    this.selectRect.visible = false;

    this.assetsPanel = new AssetsPanel(this, this.uiLayer, operate);

    // Create sidebar
    editor(document.getElementById('container'), this);

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
        this.model.rewind();
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
        let id = this.model.context.selected;

        let model = this.model.data.getObjectById(id);
        let inst = this.instMap[id];

        // TODO: Group update
        operate('object.UPDATE', ['x', inst.position.x]);
        operate('object.UPDATE', ['y', inst.position.y]);
      });
    // Cancle translate
    cancelTransform$
      .filterBy(isTranslating$)
      .onValue(() => {
        let id = this.model.context.selected;

        let model = this.model.data.getObjectById(id);
        let inst = this.instMap[id];

        inst.position.x = model.x;
        inst.position.y = model.y;
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
    // Confirm translate
    confirmTransform$
      .filterBy(isRotating$)
      .onValue(() => {
        let id = this.model.context.selected;

        let model = this.model.data.getObjectById(id);
        let inst = this.instMap[id];

        operate('object.UPDATE', ['rotation', inst.rotation]);
      });
    // Cancle translate
    cancelTransform$
      .filterBy(isRotating$)
      .onValue(() => {
        let id = this.model.context.selected;

        let model = this.model.data.getObjectById(id);
        let inst = this.instMap[id];

        inst.rotation = model.rotation;
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
    // Confirm translate
    confirmTransform$
      .filterBy(isScaling$)
      .onValue(() => {
        let id = this.model.context.selected;

        let model = this.model.data.getObjectById(id);
        let inst = this.instMap[id];

        // TODO: group operation
        operate('object.UPDATE', ['scale.x', inst.scale.x]);
        operate('object.UPDATE', ['scale.y', inst.scale.y]);
      });
    // Cancle translate
    cancelTransform$
      .filterBy(isRotating$)
      .onValue(() => {
        let id = this.model.context.selected;

        let model = this.model.data.getObjectById(id);
        let inst = this.instMap[id];

        inst.scale.copy(model.scale);
      });



    // Actions
    const insertSprite = (key) => {
      console.log(`insertSprite: ${key}`);
      operate('object.ADD', {
        type: 'Sprite',
        x: 0, y: 0,
        texture: key,
      });
    };

    // Event handlers
    this.handlers = {
      select: (id) => operate('object.SELECT', id),
      add: () => operate('ui.SHOW_ASSETS', insertSprite),
    };
  }
  awake() {
    // Plug event handlers
    this.clickObject$
      .onValue(this.handlers.select);
    this.add$
      .onValue(this.handlers.add);


    // Tests
    operate('object.ADD', {
      type: 'Text',
      name: 'info_text',
      x: 40,
      y: 200,
      style: {
        font: 'bold 64px Arial',
        fill: 'white',
      },
      text: 'It Works!',
    });

    Timer.later(60, () => {
      operate('object.SELECT', 0);
    });
  }
  exit() {
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

  // APIs
  add(objModel) {
    this.instMap[objModel.id] = this['create' + objModel.type](objModel);
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

  // Instance factory
  createContainer(obj) {
    let inst = new PIXI.Container().addTo(this.objLayer);

    inst.id = obj.id;
    inst.type = obj.type;
    inst.name = obj.name;
    inst.position.copy(obj);
    inst.rotation = obj.rotation;
    inst.scale.copy(obj.scale);
    inst.alpha = obj.alpha;
    inst.pivot.copy(obj.pivot);
    inst.skew.copy(obj.skew);
    inst.visible = obj.visible;

    return inst;
  }
  createSprite(obj) {
    let inst = new PIXI.Sprite(PIXI.Texture.fromAsset(obj.texture)).addTo(this.objLayer);

    inst.id = obj.id;
    inst.type = obj.type;
    inst.name = obj.name;
    inst.position.copy(obj);
    inst.rotation = obj.rotation;
    inst.scale.copy(obj.scale);
    inst.alpha = obj.alpha;
    inst.anchor.copy(obj.anchor);
    inst.pivot.copy(obj.pivot);
    inst.skew.copy(obj.skew);
    inst.visible = obj.visible;

    this.enableClickSelect(inst);

    return inst;
  }
  createText(obj) {
    let inst = new PIXI.Text(obj.text, obj.style, window.devicePixelRatio).addTo(this.objLayer);

    inst.id = obj.id;
    inst.type = obj.type;
    inst.name = obj.name;
    inst.position.copy(obj);
    inst.rotation = obj.rotation;
    inst.scale.copy(obj.scale);
    inst.alpha = obj.alpha;
    inst.anchor.copy(obj.anchor);
    inst.pivot.copy(obj.pivot);
    inst.skew.copy(obj.skew);
    inst.visible = obj.visible;

    this.enableClickSelect(inst);

    return inst;
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
