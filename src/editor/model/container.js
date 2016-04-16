/*
export const create = (id, { name, x, y, parent = -1 }) => ({
  id: id,
  type: 'container',
  name: name || `object_${id}`,
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

export const update = (model, param) => {
  const key = param[0];
  const value = param[1];

  switch (key) {
    case 'name':
    case 'x':
    case 'y':
    case 'rotation':
    case 'alpha':
    case 'visible':
    case 'parent':
      model.set(key, value);
      break;
  }
};
*/

import { model } from './model';

model('container')
  .number('x')
  .number('y')
  .number('rotation')
  .number('scaleX')
  .number('scaleY')
  .number('alpha')
  .number('pivotX')
  .number('pivotY')
  .number('skewX')
  .number('skewY')
  .boolean('visible', true);
