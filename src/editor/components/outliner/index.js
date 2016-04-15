import h from 'snabbdom/h';

import css from './style.css';

// View
const EMPTY = [];

let operate;
let selectedId = -1;
let objects;

const viewItem = (id) => {
  const obj = objects[id];
  if (!obj) return;

  return h(`li`, [
    h(`label.${css.name}.${css[obj.type]}${selectedId === obj.id ? '.' + css.selected : ''}`, { on: { click: [operate, 'object.SELECT', obj.id] } }, obj.name),
    h(`input.${css.toggle}`, { props: { type: 'checkbox' } }),
    h(`ol`, (obj.children || EMPTY).map(viewItem)),
  ]);
};

export default (model, op) => {
  operate = op;
  objects = model.data.objects;
  selectedId = model.context.selected;
  return h(`section.${css.outliner}`, [
    h('header', 'OUTLINER'),
    h(`ol.${css.tree}`, model.data.children.map(viewItem)),
  ]);
};
