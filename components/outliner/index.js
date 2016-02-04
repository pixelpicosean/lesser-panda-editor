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

  let selectedId = -1;
  const viewItem = (obj) => h(`li`, [
    h(`label.${css.name}.${css[obj.type]}${selectedId === obj.id ? '.' + css.selected : ''}`, { on: { click: [select, obj.id] } }, obj.name || 'object'),
    h(`input.${css.toggle}`, { props: { type: 'checkbox' } }),
    h(`ol`, (obj.children || EMPTY).map(viewItem)),
  ]);

  const view = (model) => {
    selectedId = model.selected;
    return h(`section.${css.outliner}`, [
      h('header', 'OUTLINER'),
      h(`ol.${css.tree}`, model.children.map(viewItem)),
    ]);
  }

  // Update view based on model changes
  model$.map(view).scan(patch, container)
    .onValue(() => 0);
};
