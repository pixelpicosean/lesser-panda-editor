import * as container from './container';

export const create = (id, { name, x, y, parent, text, style = {} }) => (Object.assign(container.create(id, { name, x, y, parent }), {
  type: 'text',
  anchor: { x: 0, y: 0 },
  blendMode: 'NORMAL',
  text: text || 'text',
  style: {
    font: style.font || 'bold 20px Arial',
    fill: style.fill || 'black',
  },
}));

export const update = container.update;
