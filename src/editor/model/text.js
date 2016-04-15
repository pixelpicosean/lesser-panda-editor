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

export const update = (model, param) => {
  container.update(model, param);

  const key = param[0];
  const value = param[1];

  switch (key) {
    case 'text':
    case 'blendMode':
      model.set(key, value);
      break;
    case 'anchor.x':
      model.anchor.set('x', value);
      break;
    case 'anchor.y':
      model.anchor.set('y', value);
      break;
    case 'style.font':
      model.style.set('font', value);
      break;
    case 'style.fill':
      model.style.set('fill', value);
      break;
  }
};
