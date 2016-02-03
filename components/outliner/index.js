import R from 'engine/reactive';

import snabbdom from 'editor/snabbdom';
import h from 'editor/snabbdom/h';

const patch = snabbdom.init([
  require('editor/snabbdom/modules/class'),
  require('editor/snabbdom/modules/props'),
  require('editor/snabbdom/modules/eventlisteners'),
]);

import s from './style.css';


export default (container, model$, doAction) => {
  // Actions
  // TODO: Move action event names to its own module
  const select = (id) => doAction('SELECT', id);

  // View
  const EMPTY = [];

  const view = (model) => h('section.outliner', [
    h('header', 'Outliner'),
    h('ul', model.objs.map((obj) =>
      h(`li${model.selected === obj.id ? '.' + s.selected : ''}`, { on: { click: [select, obj.id] } }, [
        h('div.leaf', obj.name || 'object'),
        h('ul.children', obj.children || EMPTY),
      ])
    )),
  ]);

  // Update view based on model changes
  model$.map(view).scan(patch, container)
    .onValue(() => 0);
};
