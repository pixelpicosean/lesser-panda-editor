import splitStyle from 'editor/split/style.css';
import style from './style.css';

import snabbdom from 'editor/snabbdom';
import h from 'editor/snabbdom/h';
import EventEmitter from 'engine/eventemitter3';
import R from 'engine/reactive';
import Split from 'editor/split';

const patch = snabbdom.init([
  require('editor/snabbdom/modules/class'),
  require('editor/snabbdom/modules/props'),
  require('editor/snabbdom/modules/eventlisteners'),
]);

const events = new EventEmitter();

// View
let leftElm, rightElm;
function setLeft(vnode) {
  leftElm = vnode.elm;
  buildSplit();
}
function setRight(vnode) {
  rightElm = vnode.elm;
  buildSplit();
}
function buildSplit() {
  if (leftElm && rightElm) {
    Split([leftElm, rightElm], {
      sizes: [25, 75],
      gutterSize: 6,
    });
  }
}

const vnode =
  h(`div.${splitStyle.split}.${splitStyle.splitHorizontal}.${style.container}`, [
    h(`div.${splitStyle.split}.${style.typeNav}`, { hook: { insert: setLeft } }),
    h(`div.${splitStyle.split}.${style.gridView}`, { hook: { insert: setRight } }),
  ]);

// Streams


export default container => patch(container, vnode);
