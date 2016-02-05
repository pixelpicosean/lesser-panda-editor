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
  require('editor/snabbdom/modules/eventlisteners'),
]);
import h from 'editor/snabbdom/h';

import css from './style.css';

// Model
import context from './context';
import data from './data';

// Components
import outliner from './components/outliner';
import inspector from './components/inspector';

const init = () => ({
  context: context(),
  data: data(),
});

let nextObjNameIdx = 0;
const createContainer = (model, { name, x, y }) => ({
  id: model.data.nextObjectId(),
  type: 'Container',
  name: name || ('object_' + (nextObjNameIdx++)),
  children: [],
  x: x || 0, y: y || 0,
  rotation: 0,
  scaleX: 1, scaleY: 1,
  alpha: 1,
  pivotX: 0, pivotY: 0,
  skewX: 0, skewY: 0,
  visible: true,
});

const createSprite = (model, { name, x, y, texture }) => (Object.assign(createContainer(model, { name, x, y }), {
  type: 'Sprite',
  anchorX: 0, anchorY: 0,
  blendMode: 'NORMAL',
  texture: texture,
}));

const factoryMethods = {
  'Container': createContainer,
  'Sprite': createSprite,
};

// Operators
const ops = {
  object: {
    SELECT: (model, param) => {
      model.context.selected = param;

      return model;
    },

    ADD: (model, param) => {
      // Create object instance
      const obj = factoryMethods[param.type](model, param);

      // Save to object store
      model.data.objectStore[obj.id] = obj;

      // Add as child of current selected object
      let parent = model.data.getObjectById(model.context.selected);
      if (parent) {
        parent.children.push(obj.id);
      }
      // Add to root is no object is selected
      else {
        model.data.children.push(obj.id);
      }

      return model;
    },
  },
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
const editor = (elm) => {

  // Editor view
  const view = (model) => h(`section.${css.sidebar}`, [
    outliner(model, operate),
    inspector(model, operate),
  ]);

  // Logic stream
  actions$
    // Update
    .scan((model, op) => op.action(model, op.param), init())
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
import Timer from 'engine/timer';

class Editor extends Scene {
  constructor() {
    super();

    editor(document.getElementById('container'));
  }
  awake() {
    operate('object.ADD', {
      type: 'Sprite',
      name: 'gameOverText',
    });
    operate('object.ADD', {
      type: 'Container',
      name: 'scoreBoard',
      x: 100,
      y: 20,
    });
    operate('object.ADD', {
      type: 'Sprite',
      name: 'playBtn',
    });
    operate('object.ADD', {
      type: 'Sprite',
      name: 'title',
    });

    operate('object.SELECT', 3);

    operate('object.ADD', {
      type: 'Sprite',
      name: 'menuFlappy',
    });

    operate('object.SELECT', -1);
    for (let i = 0; i < 10; i++) {
      operate('object.ADD', {
        type: 'Sprite',
      });
      operate('object.ADD', {
        type: 'Container',
      });
    }
  }
};
engine.addScene('Editor', Editor);
