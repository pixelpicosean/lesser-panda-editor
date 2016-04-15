import h from 'snabbdom/h';

import css from './style.css';

// View
const EMPTY = [];

let operate;
let data;
let selectedId = -1;

const viewItem = (obj) => {
  if (!obj) return;

  return h(`li`, [
    h(`label.${css.name}.${css[obj.get('type')]}${selectedId === obj.get('id') ? '.' + css.selected : ''}`, { on: { click: [operate, 'object.SELECT', obj.get('id')] } }, obj.get('name')),
    h(`input.${css.toggle}`, { props: { type: 'checkbox' } }),
    h(`ol`, (obj.get('children') || EMPTY).map(viewItem)),
  ]);
};

export default (model, op) => {
  operate = op;
  data = model.get('data');
  selectedId = -1;
  let path = model.getIn(['context', 'selected']);
  if (path) {
    selectedId = model.getIn(path).get('id');
  }
  return h(`section.${css.outliner}`, [
    h('header', 'OUTLINER'),
    h(`ol.${css.tree}`, data.get('children').map(viewItem)),
  ]);
};
