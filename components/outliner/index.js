import h from 'editor/snabbdom/h';

import css from './style.css';

// View
const EMPTY = [];

let operate;
let selectedId = -1;

const viewItem = (obj) => h(`li`, [
  h(`label.${css.name}.${css[obj.type]}${selectedId === obj.id ? '.' + css.selected : ''}`, { on: { click: [operate, 'SELECT', obj.id] } }, obj.name || 'object'),
  h(`input.${css.toggle}`, { props: { type: 'checkbox' } }),
  h(`ol`, (obj.children || EMPTY).map(viewItem)),
]);

export default (model, op) => {
  operate = op;
  selectedId = model.get('context').get('selected');
  return h(`section.${css.outliner}`, [
    h('header', 'OUTLINER'),
    h(`ol.${css.tree}`, model.getIn(['data', 'children']).toJS().map(viewItem)),
  ]);
};
