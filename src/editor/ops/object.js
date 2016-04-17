import ops from './index';
import Timer from 'engine/timer';
import { removeItems } from 'engine/utils';

import { models } from 'editor/model';

// Add operators to "object" namespace
ops.registerOperator('object', 'SELECT', {
  execute: (state, param) => {
    state.context.set('selected', param);

    // Not undoable
    return false;
  },
});

ops.registerOperator('object', 'ADD', {
  execute: (state, param) => {
    console.log(`ADD: ${param.type}`);

    // Create object instance
    const obj = models[param.type].create(param);

    // Save to object store
    state.data.objects.set(obj.id, obj);

    // Add as child of current selected object
    let parent = state.context.selected;
    if (parent !== -1) {
      state.data.objects[parent].children.push(obj.id);
    }
    // Add to root if no object is selected
    else {
      state.data.children.push(obj.id);
    }

    // Undoable
    return true;
  },
});

ops.registerOperator('object', 'UPDATE', {
  execute: (state, param) => {
    if (state.context.selected === -1) return;
    const target = state.data.objects[state.context.selected];
    models[target.type].update(target, param);

    // Undoable
    return true;
  },
});

ops.registerOperator('object', 'REMOVE', {
  execute: (model, param) => {
    // Remove model and instance
    model.data.removeObject(model.context.selected);

    // Select nothing
    model.context.selected = -1;

    // Undoable
    return true;
  },
});
