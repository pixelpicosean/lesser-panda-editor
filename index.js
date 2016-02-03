import outliner from './components/outliner';

import R from 'engine/reactive';
import EventEmitter from 'engine/eventemitter3';

import './reset.css';

// Model
const init = () => ({
  objs: [
    { id: 0, name: 'sky', children: [] },
    { id: 1, name: 'ground', children: [] },
    { id: 2, name: 'mario', },
  ],
  selected: 1,
});

// TODO: register actions the Blender way
const update = (model, { action, param }) => {
  switch (action) {
    case 'SELECT':
      model.selected = param;
      console.log(`select: ${model.selected}`);
      break;
  }

  return model;
};

let doAction;

const model$ = R.stream(e => {
    doAction = (action, param) => e.emit({ action, param });
  })
  .scan(update, init())
  .onValue(() => 0);

export default elm => outliner(elm, model$, doAction);
