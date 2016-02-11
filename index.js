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
import { clamp } from 'engine/utils';

import Mousetrap from './mousetrap';

class AssetsModal {
  constructor(scene, layer) {
    // Constants
    this.ITEM_SIZE = 100;

    // States
    this.gridBottom = 0;
    this.selectCallback = null;

    const choose = (key) => {
      if (typeof(this.selectCallback) === 'function') {
        this.selectCallback(key);
      }

      operate('ui.HIDE_ASSETS');
    };

    // Components
    this.modal = new PIXI.Graphics().addTo(layer);
    this.modal.visible = false;

    this.gridView = new PIXI.Container().addTo(this.modal);
    this.gridMask = new PIXI.Graphics().addTo(this.modal);
    this.gridView.mask = this.gridMask;
    this.gridContainer = new PIXI.Container().addTo(this.gridView);

    this.items = Object.keys(loader.resources).map((key) => {
      // Item rectangle
      let item = new PIXI.Graphics();
      item.beginFill(0xa0a0a0);
      item.drawRoundedRect(0, 0, this.ITEM_SIZE, this.ITEM_SIZE, 8);
      item.endFill();
      this.gridContainer.addChild(item);

      // Input
      item.interactive = true;
      item.on('mousedown', () => choose(key));

      // Sprite
      // TODO: create instance based on its type
      let g = new PIXI.Sprite(PIXI.Texture.fromAsset(key)).addTo(item);
      if (g.width >= g.height) {
        g.width = this.ITEM_SIZE * 0.9;
        g.scale.y = g.scale.x;
      }
      else {
        g.height = this.ITEM_SIZE * 0.9;
        g.scale.x = g.scale.y;
      }
      g.position.set((this.ITEM_SIZE - g.width) * 0.5, (this.ITEM_SIZE - g.height) * 0.5);

      // Label
      let label = new PIXI.Graphics().addTo(item);
      label.beginFill(0x000000, 0.5);
      label.drawRoundedRect(0, 0, this.ITEM_SIZE, 24, 8);
      label.endFill();
      label.position.set((this.ITEM_SIZE - label.width) * 0.5, this.ITEM_SIZE - 24);
      let t = new PIXI.Text(key, {
        font: '12px Roboto, HelveticaNeue-Light, Helvetica Neue, HelveticaNeue, Helvetica, Arial, Geneva, sans-serif',
        fill: '#ccc',
      }, window.devicePixelRatio).addTo(label);
      t.position.set((label.width - t.width) * 0.5, 4);

      return item;
    });

    engine.on('resize', this.redraw, this);

    // Setup scroll of grid view
    let wheelEvtName = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
      document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
      'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

    engine.view.addEventListener(wheelEvtName, (e) => {
      if (this.modal.visible) {
        this.panGridView(e.deltaY);

        e.preventDefault();
      }
    });

    // Register operators
    ops.ui = Object.assign(ops.ui || {}, {
      SHOW_ASSETS: (model, cb) => {
        this.show(cb);

        return model;
      },
      HIDE_ASSETS: (model) => {
        this.hide();

        return model;
      },
    });

    // Event streams
    this.esc$ = R.fromEvents(scene.events, 'esc');

    // Handlers
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  // API
  show(callback) {
    this.selectCallback = callback;
    this.modal.visible = true;

    this.esc$.onValue(this.hide);
  }
  hide() {
    this.selectCallback = null;
    this.modal.visible = false;

    this.esc$.offValue(this.hide);
  }

  redraw() {
    if (this.modal.visible) {
      this.drawModal();
      this.drawGrid();
    }
  }
  drawModal() {
    // Update modal
    this.modal.clear();
    this.modal.beginFill(0x000000);
    this.modal.drawRoundedRect(0, 0, engine.width * 0.9, engine.height * 0.9, 12);
    this.modal.endFill();

    this.modal.position.set((engine.width - this.modal.width) * 0.5, (engine.height - this.modal.height) * 0.5);

    // Update modal mask
    this.gridMask.clear();
    this.gridMask.beginFill(0x000000);
    this.gridMask.drawRect(this.gridView.x, this.gridView.y, this.gridWidth, this.gridHeight);
    this.gridMask.endFill();
  }
  drawGrid() {
    this.gridWidth = engine.width * 0.9 - 8;
    this.gridHeight = engine.height * 0.9 - 8;

    let itemsPerRow = Math.floor(this.gridWidth / this.ITEM_SIZE);

    this.items.forEach((item, idx) => {
      let r = Math.floor(idx / itemsPerRow);
      let q = idx % itemsPerRow;

      item.position.set(8 + q * (this.ITEM_SIZE + 8), 8 + r * (this.ITEM_SIZE + 8));

      this.gridBottom = Math.max(item.position.y + item.height, this.gridBottom);
    });
  }

  panGridView(fct) {
    this.gridContainer.position.y = clamp(this.gridContainer.position.y - fct, Math.min(-(this.gridBottom - this.gridHeight), 0), 0);
  }
};

class Editor extends Scene {
  constructor() {
    super();

    // Components
    this.events = new EventEmitter();

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

    this.assetsModal = new AssetsModal(this, this.uiLayer);

    // Map of object instances
    this.instMap = {};

    // Create sidebar
    editor(document.getElementById('container'), this);

    // Bind shortcuts
    Mousetrap.bind('esc', () => this.events.emit('esc'));
    Mousetrap.bind('shift+a', () => this.events.emit('add'));
  }
  awake() {
    const insertSprite = (key) => {
      console.log(`insertSprite: ${key}`);
      operate('object.ADD', {
        type: 'Sprite',
        x: 0, y: 0,
        texture: key,
      });
    };

    // Event streams
    R.fromEvents(this.events, 'click')
      .onValue((id) => this.select(id));
    R.fromEvents(this.events, 'add')
      .onValue(() => operate('ui.SHOW_ASSETS', insertSprite));


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
