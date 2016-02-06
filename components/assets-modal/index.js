import loader from 'engine/loader';

import h from 'editor/snabbdom/h';
import css from './style.css';

import ops from 'editor/ops';

let visible = false;

let operate;
let callback;

// Assets
let images = [];

// Construct a canvas for each frame
loader.on('complete', () => {
  let key, res;
  for (key in loader.resources) {
    res = loader.resources[key];
    if (res.isImage) {
      images.push({
        key: key,
        url: res.url,
      });
    }
  }
});

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

const choose = (param) => {
  if (typeof(callback) === 'function') callback(param);
  operate('ui.HIDE_ASSETS');
};

const node = (img) => h(`li.${css.gridNode}`, { style: { backgroundImage: `url(${img.url})` }, on: { click: [choose, img.key] } }, [
  h(`label.${css.label}`, img.key),
]);

export default (model, op) => {
  operate = op;

  if (!model.data.images) {
    model.data.images = images;
  }

  return visible ?
    h(`section.${css.modal}`, [
      h(`header`, 'ASSETS'),
      h(`section.${css.content}`, [
        h(`ol.${css.typeNav}`),
        h(`ol.${css.grid}`, images.map(node)),
      ]),
    ]) : EMPTY;
}
