import ops from './index';
import Timer from 'engine/timer';
import { removeItems } from 'engine/utils';

import Immutable from 'immutable';

let nextObjId = 0;
const createContainer = ({ name, x, y, parent = -1 }) => ({
  id: nextObjId++,
  type: 'Container',
  name: name || `object_${nextObjId}`,
  children: [],
  x: x || 0, y: y || 0,
  rotation: 0,
  scale: { x: 1, y: 1 },
  alpha: 1,
  pivot: { x: 0, y: 0 },
  skew: { x: 0, y: 0 },
  visible: true,
  parent: parent,
});

const createSprite = ({ name, x, y, parent, texture }) => (Object.assign(createContainer({ name, x, y, parent }), {
  type: 'Sprite',
  anchor: { x: 0, y: 0 },
  blendMode: 'NORMAL',
  texture: texture,
}));

const createText = ({ name, x, y, parent, text, style = {} }) => (Object.assign(createContainer({ name, x, y, parent }), {
  type: 'Text',
  anchor: { x: 0, y: 0 },
  blendMode: 'NORMAL',
  text: text || 'text',
  style: {
    font: style.font || 'bold 20px Arial',
    fill: style.fill || 'black',
  },
}));

const factoryMethods = {
  Container: createContainer,
  Sprite: createSprite,
  Text: createText,
};

// Add operators to "object" namespace
ops.registerOperator('object', 'SELECT', {
  rewindable: false,
  execute: (model, param) => {
    return model.updateIn(['context', 'selected'], () => param);
  },
});

ops.registerOperator('object', 'ADD', {
  rewindable: true,
  execute: (model, param) => {
    // Create object instance
    const obj = factoryMethods[param.type](param);

    // Add as child of current selected object
    let childPath, parentPath = model.getIn(['context', 'selected']);
    if (parentPath) {
      childPath = parentPath.slice().push('children');
    }
    // Add to root if no object is selected
    else {
      childPath = ['data', 'children'];
    }

    return model.updateIn(childPath, (arr) => {
      childPath.push(arr.size);
      obj.cursor = childPath;
      return arr.push(Immutable.fromJS(obj));
    });
  },
});

ops.registerOperator('object', 'UPDATE', {
  rewindable: true,
  execute: (model, param) => {
    if (updateHandlers[param[0]]) {
      updateHandlers[param[0]](model, param);
    }
    else {
      simpleAssign(model, param);
    }

    return model;
  },
});

ops.registerOperator('object', 'REMOVE', {
  rewindable: true,
  execute: (model, param) => {
    // Remove model and instance
    model.data.removeObject(model.context.selected);

    // Select nothing
    model.context.selected = -1;

    return model;
  },
});
