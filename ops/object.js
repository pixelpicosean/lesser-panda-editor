import ops from './index';

let nextObjNameIdx = 0;
const createContainer = (model, { name, x, y }) => ({
  id: model.data.nextObjectId(),
  type: 'Container',
  name: name || ('object_' + (nextObjNameIdx++)),
  children: [],
  x: x || 0, y: y || 0,
  rotation: 0,
  scaleX: 1, scaleY: 1,
  alpha: 1,
  pivotX: 0, pivotY: 0,
  skewX: 0, skewY: 0,
  visible: true,
});

const createSprite = (model, { name, x, y, texture }) => (Object.assign(createContainer(model, { name, x, y }), {
  type: 'Sprite',
  anchorX: 0, anchorY: 0,
  blendMode: 'NORMAL',
  texture: texture,
}));

const createText = (model, { name, x, y, text, font, fill }) => (Object.assign(createContainer(model, { name, x, y }), {
  type: 'Text',
  anchorX: 0, anchorY: 0,
  blendMode: 'NORMAL',
  text: text || 'text',
  font: font || 'bold 20px Arial',
  fill: fill || 'black',
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
};
