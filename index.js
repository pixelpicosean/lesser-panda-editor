import Renderer from 'engine/renderer';
import config from 'game/config';
config.resizeMode = 'dom';

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

const init = (view2d) => ({
  context: context(),
  data: data(),
  view2d: view2d,
});

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
  const view = (model) => h(`section.${css.sidebar}`, [
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

import AssetsModal from './components/assets-modal';

class Editor extends Scene {
  constructor() {
    super();

    // States
    this.events = new EventEmitter();

    this.instMap = {};
    this.selectedInst = null;

    // Layers
    this.bgLayer = new PIXI.Container().addTo(this.stage);
    this.objLayer = new PIXI.Container().addTo(this.stage);
    this.uiLayer = new PIXI.Container().addTo(this.stage);

    Timer.interval(100, () => {
      engine.resizeFunc();
    });

    // UI elements
    this.selectRect = new PIXI.Graphics().addTo(this.uiLayer);
    this.selectRect.visible = false;

    this.assetsModal = new AssetsModal(this, this.uiLayer, operate);

    // Create sidebar
    editor(document.getElementById('container'), this);

    // Bind shortcuts
    Mousetrap.bind('esc', () => this.events.emit('esc'));
    Mousetrap.bind('shift+a', () => this.events.emit('add'));
    Mousetrap.bind('g', () => this.events.emit('g'));

    // Event streams
    this.click$ = R.fromEvents(this.events, 'click');
    this.add$ = R.fromEvents(this.events, 'add');

    this.stage.interactive = true;
    this.stage.containsPoint = () => true;
    let mousemove$ = R.fromEvents(this.stage, 'mousemove');

    let g$ = R.fromEvents(this.events, 'g');

    let isMovingSrc$ = R.pool();

    let isMoving$ = isMovingSrc$.toProperty(() => false);
    let notMoving$ = isMoving$.map(t => !t);

    let startMove$ = g$
      .filter(() => !!this.selectedInst)
      .filterBy(notMoving$);
    let endMove$ = startMove$
      .flatMapLatest(() => g$);

    startMove$.log('startMove');
    endMove$.log('endMove');

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
    moveDelta$.log('moveDelta');

    moveDelta$.onValue((move) => {
      this.selectedInst.position.add(move[0], move[1]);
    });
    endMove$.onValue(() => {
      console.log(`pos: (${this.selectedInst.position.x}, ${this.selectedInst.position.y})`);
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
    this.click$
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
    this.click$
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
      this.events.emit('click', obj.id);
      e.stopPropagation();
    });
  }
};
engine.addScene('Editor', Editor);
