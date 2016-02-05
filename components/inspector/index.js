import h from 'editor/snabbdom/h';

import css from './style.css';

// View
const EMPTY = [];

let operate;

const views = {
  'sprite': (sprite, op) => ([
    h(`label`, 'Name:'), h(`label`, sprite.get('name')),
  ]),
};

const view = (model, op) => {
  if (views.hasOwnProperty(model.get('type'))) {
    return views[model.get('type')](model, op);
  }
};

function fetchSelectedModel(children, id) {
  let m = children.find(c => c.get('id') === id);
  return (m ? m : fetchSelectedModel(m.get('children'), id));
}

export default (model, op) => {
  operate = op;
  let selectedId = model.get('context').get('selected');
  let obj = fetchSelectedModel(model.getIn(['data', 'children']), selectedId);
  console.log(obj.toJSON());

  return h(`section.${css.inspector}`, [
    h('header', 'INSPECTOR'),
    h(`ul.${css.tree}`, obj ? view(obj, op) : EMPTY),
  ]);
};
