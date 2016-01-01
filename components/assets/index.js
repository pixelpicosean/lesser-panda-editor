import splitStyle from 'editor/split/style.css';
import style from './style.css';

import snabbdom from 'editor/snabbdom';
import h from 'editor/snabbdom/h';
import EventEmitter from 'engine/eventemitter3';
import R from 'engine/reactive';
import Split from 'editor/split';
import loader from 'engine/loader';

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
      minSize: [100, 300],
      gutterSize: 4,
    });
  }
}

// Streams
let frameKeys$ = R.fromEvents(loader, 'complete')
  .map(() => Object.keys(loader.resources))
  .toProperty()
  .onValue(() => 0);

const node = key => h(`div.${style.gridNode}`, key);

const view = keys => {
  return h(`div.${splitStyle.split}.${splitStyle.splitHorizontal}.${style.container}`, [
    h(`div.${splitStyle.split}.${style.typeNav}`, { hook: { insert: setLeft } }),
    h(`div.${splitStyle.split}.${style.gridView}`, { hook: { insert: setRight } }, keys.map(node)),
  ]);
}

export default container => {
  frameKeys$.map(view).scan(patch, container)
    .onValue(() => 0);
}
