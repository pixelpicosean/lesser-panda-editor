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
