import h from 'editor/snabbdom/h';

import css from './style.css';

// View
const EMPTY = [];

let operate;

const views = {
  'sprite': (sprite, op) => ([
    h(`label`, 'Name:'), h(`label`, sprite.name),
  ]),
};

const view = (obj, op) => {
  if (views.hasOwnProperty(obj.type)) {
    return views[obj.type](obj, op);
  }
};

export default (model, op) => {
  operate = op;
  let obj = model.data.getObjectById(model.context.selected);

  return h(`section.${css.inspector}`, [
    h('header', 'INSPECTOR'),
    h(`ul.${css.tree}`, obj ? view(obj, op) : EMPTY),
  ]);
};
