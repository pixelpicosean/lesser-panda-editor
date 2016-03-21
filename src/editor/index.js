import Renderer from 'engine/renderer';
import config from 'game/config';
config.resizeMode = 'crop';

import R from 'engine/reactive';
import EventEmitter from 'engine/eventemitter3';

import snabbdom from 'editor/snabbdom';
const patch = snabbdom.init([
  require('editor/snabbdom/modules/class'),
  require('editor/snabbdom/modules/props'),
  require('editor/snabbdom/modules/attributes'),
  require('editor/snabbdom/modules/style'),
  require('editor/snabbdom/modules/eventlisteners'),
]);
import h from 'editor/snabbdom/h';

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
  };

  view2d.model = model;

  return model;
};

// Operation dispatcher
let emitter;
const index = (o, i) => (o ? o[i] : undefined);
const operate = (actStr, param) => {
  let action = actStr.split('.').reduce(index, ops);
  if (action) {
    emitter.emit({ action, param });
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
    .scan((model, op) => op.action(model, op.param), init(view2d))
    // View
    .map(view)
    // Apply to editor element
    .scan(patch, elm)
    // Logging
    .onError(err => console.log(err));

  // Fix canvas style issue
  Renderer.resize(100, 100);

};

// Editor scene
import engine from 'engine/core';
import Scene from 'engine/scene';
import PIXI from 'engine/pixi';
import Timer from 'engine/timer';
import loader from 'engine/loader';

import Mousetrap from './mousetrap';

import AssetsPanel from './components/assets-panel';

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
    Mousetrap.bind('shift+a', () => this.events.emit('add'));
    Mousetrap.bind('g', () => this.events.emit('g'));

    // Event streams
    this.add$ = R.fromEvents(this.events, 'add');

    let esc$ = R.fromEvents(this.events, 'esc');
    let enter$ = R.fromEvents(this.events, 'enter');

    this.stage.interactive = true;
    this.stage.containsPoint = () => true;
    let mousemove$ = R.fromEvents(this.stage, 'mousemove');
    let mousedown$ = R.fromEvents(engine.view, 'mousedown');

    let g$ = R.fromEvents(this.events, 'g');

    let isMovingSrc$ = R.pool();

    let isMoving$ = isMovingSrc$.toProperty(() => false);
    let notMoving$ = isMoving$.map(t => !t);

    let startMove$ = g$
      .filter(() => !!this.selectedInst)
      .filterBy(notMoving$);

    let confirmMove$ = startMove$
      .flatMapLatest(() => R.merge([mousedown$, enter$]));
    let cancelMove$ = startMove$
      .flatMapLatest(() => esc$);

    let confirmOrCancelMove$ = R.merge([
      confirmMove$,
      cancelMove$,
    ]);

    let endMove$ = startMove$
      .flatMapLatest(() => confirmOrCancelMove$);

    isMovingSrc$.plug(startMove$.map(() => true));
    isMovingSrc$.plug(endMove$.map(() => false));

    const data2Pos = (d) => ([
      d.data.global.x,
      d.data.global.y,
    ]);
    const posDiff = (p, n) => ([
      n[0] - p[0],
      n[1] - p[1],
    ]);

    const moveDelta$ = startMove$.flatMap(() => {
      const startPos = [
        Renderer.instance.plugins.interaction.eventData.data.global.x,
        Renderer.instance.plugins.interaction.eventData.data.global.y,
      ];
      return mousemove$.takeUntilBy(endMove$)
        .map(data2Pos)
        .diff(posDiff, startPos);
    });

    this.clickObject$ = R.fromEvents(this.events, 'clickObject')
      .filterBy(notMoving$);

    startMove$.onValue(() => {
      // Hide select rect while moving
      // TODO: change rect color and sync with target instead
      this.selectRect.visible = false;
    });
    endMove$.onValue(() => {
      // Update and show select rect
      this.updateRectOf(this.model.context.selected);
      this.selectRect.visible = true;
    });

    moveDelta$.onValue((move) => {
      this.selectedInst.position.add(move[0], move[1]);
    });

    confirmMove$.onValue(() => {
      let id = this.model.context.selected;

      let model = this.model.data.getObjectById(id);
      let inst = this.instMap[id];

      // TODO: Group update
      operate('object.UPDATE', ['x', inst.position.x]);
      operate('object.UPDATE', ['y', inst.position.y]);
    });

    cancelMove$.onValue(() => {
      let id = this.model.context.selected;

      let model = this.model.data.getObjectById(id);
      let inst = this.instMap[id];

      inst.position.x = model.x;
      inst.position.y = model.y;
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
    g.lineStyle(1, 0x39bdfd);
    g.drawRect(bounds.x - target.pivot.x, bounds.y - target.pivot.y, bounds.width, bounds.height);
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
