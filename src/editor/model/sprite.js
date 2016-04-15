import * as container from './container';

export const create = (id, { name, x, y, parent, texture }) => (Object.assign(container.create(id, { name, x, y, parent }), {
  type: 'sprite',
  anchor: { x: 0, y: 0 },
  blendMode: 'NORMAL',
  texture: texture,
}));

export const update = container.update;
