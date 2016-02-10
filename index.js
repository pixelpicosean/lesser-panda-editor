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
import assetsModal from './components/assets-modal';

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
    assetsModal(model, operate),
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

import Mousetrap from './mousetrap';

class Editor extends Scene {
  constructor() {
    super();

    // Layers
    this.bgLayer = new PIXI.Container().addTo(this.stage);
    this.objLayer = new PIXI.Container().addTo(this.stage);
    this.uiLayer = new PIXI.Container().addTo(this.stage);

    // Map of object instances
    this.instMap = {};

    editor(document.getElementById('container'), this);
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

    // Setup shortcuts handlers
    const add = () => {
      operate('ui.SHOW_ASSETS', insertSprite);
    };

    Mousetrap.bind('shift+a', add);

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

    operate('object.SELECT', 0);
  }
  exit() {
    // Remove shortcut handlers
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

    return inst;
  }
};
engine.addScene('Editor', Editor);
