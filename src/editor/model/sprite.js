/*
import * as container from './container';

export const create = (id, { name, x, y, parent, texture }) => (Object.assign(container.create(id, { name, x, y, parent }), {
  type: 'sprite',
  anchor: { x: 0, y: 0 },
  blendMode: 'NORMAL',
  texture: texture,
}));

export const update = (model, param) => {
  container.update(model, param);

  const key = param[0];
  const value = param[1];

  switch (key) {
    case 'texture':
    case 'blendMode':
      model.set(key, value);
      break;
    case 'anchor.x':
      model.anchor.set('x', value);
      break;
    case 'anchor.y':
      model.anchor.set('y', value);
      break;
  }
};
*/

import { model } from './model';
