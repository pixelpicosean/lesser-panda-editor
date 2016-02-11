import ops from './index';
import Timer from 'engine/timer';

let nextObjNameIdx = 0;
const createContainer = (model, { name, x, y, parent = -1 }) => ({
  id: model.data.nextObjectId(),
  type: 'Container',
  name: name || ('object_' + (nextObjNameIdx++)),
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

const createSprite = (model, { name, x, y, parent, texture }) => (Object.assign(createContainer(model, { name, x, y, parent }), {
  type: 'Sprite',
  anchor: { x: 0, y: 0 },
  blendMode: 'NORMAL',
  texture: texture,
}));

const createText = (model, { name, x, y, parent, text, style = {} }) => (Object.assign(createContainer(model, { name, x, y, parent }), {
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

// Default update handler
const simpleAssign = (model, param) => {
  // Get model and its view2d instance
  let target = model.data.getObjectById(model.context.selected);
  let inst = model.view2d.get(target.id);

  // Find property to udpate
  let keys = param[0].split('.');
  let field = target;
  let instField = inst;
  for (let i = 0; i < keys.length - 1; i++) {
    field = target[keys[i]];
    instField = inst[keys[i]];
  }

  // Apply the change
  if (keys.length > 1) {
    field[keys[keys.length - 1]] = instField[keys[keys.length - 1]] = param[1];
  }
  else {
    field[param[0]] = instField[param[0]] = param[1];
  }
};
// Update handlers
const updateHandlers = {
  parent: (model, param) => {
    let target = model.data.getObjectById(model.context.selected);
    let parent = (target.parent < 0 ? model.data : model.data.getObjectById(target.parent));
    // Remove from current paretn
    parent.children.splice(parent.children.indexOf(target.id), 1);
    // Add to new parent
    parent = model.data.getObjectById(param);
    parent.children.push(target.id);

    // Change parent in view2d
    model.view2d.changeParent(model.context.selected, param);
  },
};

// Add operators to "object" namespace
ops.object = {
  SELECT: (model, param) => {
    // Save selected object to context
    model.context.selected = param;

    // Select in view2d
    // TODO: use some obeserve mechanism instead of directly calling
    model.view2d.select(param);

    return model;
  },

  ADD: (model, param) => {
    // Create object instance
    const obj = factoryMethods[param.type](model, param);

    // Save to object store
    model.data.objectStore[obj.id] = obj;

    // Add as child of current selected object
    let parent = model.data.getObjectById(model.context.selected);
    if (parent) {
      parent.children.push(obj.id);
    }
    // Add to root is no object is selected
    else {
      model.data.children.push(obj.id);
    }

    // Create a instance and add it to view2d
    model.view2d.add(obj);

    return model;
  },

  UPDATE: (model, param) => {
    if (updateHandlers[param[0]]) {
      updateHandlers[param[0]](model, param);
    }
    else {
      simpleAssign(model, param);
    }

    // TODO: use obeserver instead of directly calling
    Timer.later(10, () => {
      model.view2d.updateRectOf(model.context.selected);
    });

    return model;
  },

  REMOVE: (model) => {
    // Remove model and instance
    model.data.removeObject(model.context.selected);
    model.view2d.remove(model.context.selected);

    // Select nothing
    model.context.selected = -1;

    return model;
  },
};
