import h from 'snabbdom/h';

import css from './style.css';

// View
const EMPTY = [];
let operate;

const readonly = (key, value) => h(`li.${css.prop}`, [
  h(`div.${css.key}`, key),
  h(`input.${css.value}.${css.readonly}`, {
    props: {
      type: 'text',
      value: value,
    },
    attrs: {
      readonly: true,
    },
  }),
]);

const text = (key, value) => {
  const changed = (e) => operate('object.UPDATE', [key, e.target.value]);
  return h(`li.${css.prop}`, [
    h(`div.${css.key}`, key),
    h(`input.${css.value}.${css.text}`, {
      props: {
        type: 'text',
        value: value,
      },
      on: { change: changed },
    }),
  ]);
};

const number = (key, value) => {
  const changed = (e) => operate('object.UPDATE', [key, e.target.value]);
  return h(`li.${css.prop}`, [
    h(`div.${css.key}`, key),
    h(`input.${css.value}.${css.number}`, {
      props: {
        type: 'number',
        value: value,
      },
      on: { change: changed },
    }),
  ]);
};

const views = {
  container: (c, op) =>([
    readonly('type', c.type),
    text('name', c.name),
    number('x', c.x),
    number('y', c.y),
    number('rotation', c.rotation),
    number('scaleX', c.scaleX),
    number('scaleY', c.scaleY),
    number('alpha', c.alpha),
    number('pivotX', c.pivotX),
    number('pivotY', c.pivotY),
    number('skewX', c.skewX),
    number('skewY', c.skewY),
    // toggle('visible', true),
  ]),

  sprite: (sprite, op) => ([
    readonly('type', sprite.type),
    text('name', sprite.name),
    number('x', sprite.x),
    number('y', sprite.y),
    number('rotation', sprite.rotation),
    number('scaleX', sprite.scaleX),
    number('scaleY', sprite.scaleY),
    number('alpha', sprite.alpha),
    number('anchorX', sprite.anchorX),
    number('anchorY', sprite.anchorY),
    number('pivotX', sprite.pivotX),
    number('pivotY', sprite.pivotY),
    number('skewX', sprite.skewX),
    number('skewY', sprite.skewY),
    // toggle('visible', true),
  ]),

  text: (t, op) => ([
    readonly('type', t.type),
    text('name', t.name),
    text('text', t.text),
    text('font', t.font),
    text('fill', t.fill),
    number('x', t.x),
    number('y', t.y),
    number('rotation', t.rotation),
    number('scaleX', t.scaleX),
    number('scaleY', t.scaleY),
    number('alpha', t.alpha),
    number('anchorX', t.anchorX),
    number('anchorY', t.anchorY),
    number('pivotX', t.pivotX),
    number('pivotY', t.pivotY),
    number('skewX', t.skewX),
    number('skewY', t.skewY),
    // toggle('visible', true),
  ]),
};

const view = (obj, op) => {
  if (views.hasOwnProperty(obj.type)) {
    return views[obj.type](obj, op);
  }
};

export default (model, op) => {
  operate = op;
  let obj, idx = model.context.selected;
  if (idx !== -1) {
    obj = model.data.objects[idx];
  }

  return h(`section.${css.inspector}`, [
    h('header', 'INSPECTOR'),
    h(`ul.${css.tree}`, obj ? view(obj, op) : EMPTY),
  ]);
};
