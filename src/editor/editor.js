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

import Immutable from 'immutable';

// Model
import context from './context';
import data from './data';

// Operators
import ops from './ops';
import './ops/object';

// Components
import outliner from './components/outliner';
import inspector from './components/inspector';

const init = () => Immutable.fromJS({
  context: context(),
  data: data(),
});

// Operation dispatcher
let emitter;
const index = (o, i) => (o ? o[i] : undefined);
const operate = (actStr, param) => {
  let operator = actStr.split('.').reduce(index, ops);
  if (operator) {
    emitter.emit({ operator, param });
  }
  else {
    emitter.error(`WARNING: operator "${actStr}" not found`);
  }
};

// Action stream
const actions$ = R.stream(e => emitter = e);

// Editor factory
const editor = (elm, view2d) => {

  // Editor view
  const view = (model) => h(`section.${css.sidebar}`, {
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
    outliner(model, operate),
    inspector(model, operate),
  ]);

  // Model events
  const model$ = actions$.scan((model, act) => {
    return act.operator.execute(model, act.param);
  }, init());

  // Update DOM view
  model$.map(view).scan(patch, elm).onError(err => console.log(err));

  // Update View2D
  model$.map(view2d(operate)).onError(err => console.log(err));
};

export default editor;
