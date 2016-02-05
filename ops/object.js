import ops from './index';

let nextObjNameIdx = 0;
const createContainer = (model, { name, x, y }) => ({
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
});

const createSprite = (model, { name, x, y, texture }) => (Object.assign(createContainer(model, { name, x, y }), {
  type: 'Sprite',
  anchor: { x: 0, y: 0 },
  blendMode: 'NORMAL',
  texture: texture,
}));

const createText = (model, { name, x, y, text, style = {} }) => (Object.assign(createContainer(model, { name, x, y }), {
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
ops.object = {
  SELECT: (model, param) => {
    model.context.selected = param;

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
    // Get model its view2d instance
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

    return model;
  },
};
