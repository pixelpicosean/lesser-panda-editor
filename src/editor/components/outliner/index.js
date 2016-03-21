import h from 'editor/snabbdom/h';

import css from './style.css';

// View
const EMPTY = [];

let operate;
let data;
let selectedId = -1;

const viewItem = (objId) => {
  let obj = data.getObjectById(objId);
  if (!obj) return;

  return h(`li`, [
    h(`label.${css.name}.${css[obj.type]}${selectedId === obj.id ? '.' + css.selected : ''}`, { on: { click: [operate, 'object.SELECT', obj.id] } }, obj.name),
    h(`input.${css.toggle}`, { props: { type: 'checkbox' } }),
    h(`ol`, (obj.children || EMPTY).map(viewItem)),
  ]);
};

export default (model, op) => {
  operate = op;
  data = model.data;
  selectedId = model.context.selected;
  return h(`section.${css.outliner}`, [
    h('header', 'OUTLINER'),
    h(`ol.${css.tree}`, model.data.children.map(viewItem)),
  ]);
};
