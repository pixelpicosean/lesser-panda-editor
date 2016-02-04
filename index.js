import Renderer from 'engine/renderer';
import config from 'game/config';
config.resizeMode = 'dom';

import R from 'engine/reactive';
import EventEmitter from 'engine/eventemitter3';
import Immutable from './immutable';

import snabbdom from 'editor/snabbdom';
const patch = snabbdom.init([
  require('editor/snabbdom/modules/class'),
  require('editor/snabbdom/modules/props'),
  require('editor/snabbdom/modules/eventlisteners'),
]);
import h from 'editor/snabbdom/h';

import outliner from './components/outliner';

import css from './style.css';

const initContext = () => ({
  selected: 1,
  nextId: 4,
});
const initData = () => ({
  children: [
    {
      id: 0,
      type: 'sprite',
      name: 'sky',
      children: [],
    },
    {
      id: 1,
      type: 'sprite',
      name: 'ground',
      children: [
        {
          id: 2,
          type: 'sprite',
          name: 'coin',
          children: [],
        },
      ],
    },
    {
      id: 3,
      type: 'animation',
      name: 'mario',
      children: [],
    },
  ],
});
const init = () => Immutable.fromJS({
  context: initContext(),
  data: initData(),
});


// Operators
const ops = {
  SELECT: (model, param) => model.setIn(['context', 'selected'], param),

  CREATE: (model, param) => {
    let nextId = model.getIn(['context', 'nextId']);
    return model.setIn(['context', 'nextId'], nextId + 1)
      .updateIn(['data', 'children'], (arr) => arr.push(Immutable.fromJS({
        id: nextId,
        type: 'sprite',
        name: 'object',
        children: [],
      })));
  },
};


let operate;
const actions$ = R.stream((e) => operate = (action, param) => e.emit({ action, param }));

const editor = (elm) => {
  const view = (model) => h(`section.${css.sidebar}`, [
    outliner(model, operate),
    outliner(model, operate),
  ]);

  actions$
    // Update
    .scan((model, op) => {
      if (ops.hasOwnProperty(op.action)) {
        return ops[op.action](model, op.param);
      }
      else {
        console.log(`WARNING: operator "${op.action}" not found`);
        return model;
      }
    }, init())
    // View
    .map(view)
    // Apply to editor element
    .scan(patch, elm)
    // Active the stream
    .onValue(() => 0);;

  Renderer.resize(100, 100);
};

import engine from 'engine/core';
import Scene from 'engine/scene';
import Timer from 'engine/timer';

class Editor extends Scene {
  constructor() {
    super();

    editor(document.getElementById('container'));
  }
  awake() {
    Timer.later(2000, () => operate('CREATE', 'sprite'));
  }
};
engine.addScene('Editor', Editor);
