import Renderer from 'engine/renderer';
import config from 'game/config';
config.resizeMode = 'crop';

import R from 'engine/reactive';

import snabbdom from 'snabbdom';
const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/attributes'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
]);
import h from 'snabbdom/h';

import Split from 'editor/split';

import css from './style.css';

import Freezer from 'freezer-js';

// Model
import context from './context';
import data from './data';

// Operators
import ops from './ops';
import './ops/object';

// Components
import outliner from './components/outliner';
import inspector from './components/inspector';

const init = () => (new Freezer({
  context: context(),
  data: data(),
}, {
  // live: true,
}));

// Editor factory
const editor = (elm, view2d) => {

  // Store
  const store = init();
  const state$ = R.fromEvents(store, 'update')
    .toProperty(() => store.get());

  // Undo/redo
  let past = [];
  let present = store.get();
  let future = [];
  let lastIsUndoable = false;
  let isBatch = false;
  ops.registerOperator('data', 'UNDO', {
    execute: () => {
      const prev = past.pop();
      if (prev) {
        future.unshift(present);
        present = prev;

        store.set(present);
      }

      return false;
    },
  });
  ops.registerOperator('data', 'REDO', {
    execute: () => {
      const next = future.shift();
      if (next) {
        past.push(present);
        present = next;

        store.set(present);
      }

      return false;
    },
  });
  state$.onValue((newState) => {
    if (isBatch) {}
    else if (!lastIsUndoable) {
      present = newState;
    }
    else if (present !== newState) {
      past.push(present);
      present = newState;
      future.length = 0;
    }
  });

  // Operation dispatcher
  const index = (o, i) => (o ? o[i] : undefined);
  const batch = (v) => { isBatch = !!v; };
  const operate = (actStr, param) => {
    let operator = actStr.split('.').reduce(index, ops);
    if (operator) {
      lastIsUndoable = !!(operator.execute(store.get(), param, batch));
    }
    else {
      console.log(`WARNING: operator "${actStr}" not found`);
    }
  };

  // Editor view
  const view = (state) => h(`section.${css.sidebar}`, {
    hook: {
      key: 'sidebar',
      insert: (vnode) => {
        if (vnode.elm.hasChildNodes()) {
          Split(Array.prototype.slice.call(vnode.elm.childNodes), {
            direction: 'vertical',
            minSize: 20,
          });
        }
      },
    },
  }, [
    outliner(state, operate),
    inspector(state, operate),
  ]);

  // Update DOM view
  state$.map(view).scan(patch, elm).onError(err => console.log(err));

  // Update View2D
  state$.map(view2d(operate)).onError(err => console.log(err));
};

export default editor;
