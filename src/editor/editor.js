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

  // Operation dispatcher
  const index = (o, i) => (o ? o[i] : undefined);
  const operate = (actStr, param) => {
    let operator = actStr.split('.').reduce(index, ops);
    if (operator) {
      operator.execute(store.get(), param);
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
