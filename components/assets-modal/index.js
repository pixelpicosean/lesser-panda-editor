import loader from 'engine/loader';

import h from 'editor/snabbdom/h';
import css from './style.css';

import ops from 'editor/ops';

let visible = false;

let operate;

let callback;
const choose = (param) => {
  if (typeof(callback) === 'function') callback(param);
  operate('ui.HIDE_ASSETS');
};

// Operators
ops.ui = Object.assign(ops.ui || {}, {
  SHOW_ASSETS: (model, cb) => {
    visible = true;
    callback = cb;

    return model;
  },
  HIDE_ASSETS: (model) => {
    visible = false;
    callback = null;

    return model;
  },
});

// View
const EMPTY = '';

const node = (key) => h(`li.${css.gridNode}`, {
  on: { click: [choose, key] },
}, key);

export default (model, op) => {
  operate = op;

  return visible ?
    h(`section.${css.modal}`, [
      h(`ol.${css.typeNav}`),
      h(`ol.${css.grid}`, Object.keys(loader.resources).map(node)),
    ]) : EMPTY;
}
