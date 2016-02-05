import h from 'editor/snabbdom/h';

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

const text = (key, value) => h(`li.${css.prop}`, [
  h(`div.${css.key}`, key),
  h(`input.${css.value}.${css.text}`, {
    props: {
      type: 'text',
      value: value,
    },
  }),
]);

const number = (key, value) => h(`li.${css.prop}`, [
  h(`div.${css.key}`, key),
  h(`input.${css.value}.${css.number}`, {
    props: {
      type: 'number',
      value: value,
    },
  }),
]);

const views = {
  Container: (c, op) =>([
    readonly('type', c.type),
    text('name', c.name),
    number('pos.x', c.x),
    number('pos.y', c.y),
    number('rotation', c.rotation),
    number('scale.x', c.scaleX),
    number('scale.y', c.scaleY),
    number('alpha', c.alpha),
    number('pivot.x', c.pivotX),
    number('pivot.y', c.pivotY),
    number('skew.x', c.skewX),
    number('skew.y', c.skewY),
    // toggle('visible', true),
  ]),

  Sprite: (sprite, op) => ([
    readonly('type', sprite.type),
    text('name', sprite.name),
    number('pos.x', sprite.x),
    number('pos.y', sprite.y),
    number('rotation', sprite.rotation),
    number('scale.x', sprite.scaleX),
    number('scale.y', sprite.scaleY),
    number('alpha', sprite.alpha),
    number('anchor.x', sprite.pivotX),
    number('anchor.y', sprite.pivotY),
    number('pivot.x', sprite.pivotX),
    number('pivot.y', sprite.pivotY),
    number('skew.x', sprite.skewX),
    number('skew.y', sprite.skewY),
    // toggle('visible', true),
  ]),

  Text: (t, op) => ([
    readonly('type', t.type),
    text('name', t.name),
    text('text', t.text),
    text('font', t.font),
    text('fill', t.fill),
    number('pos.x', t.x),
    number('pos.y', t.y),
    number('rotation', t.rotation),
    number('scale.x', t.scaleX),
    number('scale.y', t.scaleY),
    number('alpha', t.alpha),
    number('anchor.x', t.pivotX),
    number('anchor.y', t.pivotY),
    number('pivot.x', t.pivotX),
    number('pivot.y', t.pivotY),
    number('skew.x', t.skewX),
    number('skew.y', t.skewY),
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
  let obj = model.data.getObjectById(model.context.selected);

  return h(`section.${css.inspector}`, [
    h('header', 'INSPECTOR'),
    h(`ul.${css.tree}`, obj ? view(obj, op) : EMPTY),
  ]);
};
