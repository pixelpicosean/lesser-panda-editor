import outliner from './components/outliner';

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

import './style.css';

const initContext = () => ({
  selected: 1,
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
  SELECT: (model, param) => model.updateIn(['context', 'selected'], param),
};

export default elm => {
  let operate;

  const view = (model) => h('section.editor', [
    outliner(model, operate),
  ]);

  R.stream((e) => operate = (action, param) => e.emit({ action, param }))
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
    .onValue(() => 0);
};
