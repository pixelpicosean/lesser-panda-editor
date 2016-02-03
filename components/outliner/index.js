import R from 'engine/reactive';

import snabbdom from 'editor/snabbdom';
import h from 'editor/snabbdom/h';

const patch = snabbdom.init([
  require('editor/snabbdom/modules/class'),
  require('editor/snabbdom/modules/props'),
  require('editor/snabbdom/modules/eventlisteners'),
]);

import css from './style.css';


export default (container, model$, doAction) => {
  // Actions
  // TODO: Move action event names to its own module
  const select = (id) => doAction('SELECT', id);

  // View
  const EMPTY = [];

  const viewItem = (obj) => h(`li`, [
    h(`label.${css.name}.${css[obj.type]}`, { on: { click: [select, obj.id] } }, obj.name || 'object'),
    h(`input.${css.toggle}`, { props: { type: 'checkbox' } }),
    h(`ol`, (obj.children || EMPTY).map(viewItem)),
  ]);

  const view = (model) => h('section.outliner', [
    h('header', 'Outliner'),
    h(`ol.${css.tree}`, model.children.map(viewItem)),
  ]);

  // Update view based on model changes
  model$.map(view).scan(patch, container)
    .onValue(() => 0);
};
