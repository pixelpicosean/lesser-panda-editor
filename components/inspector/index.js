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
    number('scale.x', c.scale.x),
    number('scale.y', c.scale.y),
    number('alpha', c.alpha),
    number('pivot.x', c.pivot.x),
    number('pivot.y', c.pivot.y),
    number('skew.x', c.skew.x),
    number('skew.y', c.skew.y),
    // toggle('visible', true),
  ]),

  Sprite: (sprite, op) => ([
    readonly('type', sprite.type),
    text('name', sprite.name),
    number('pos.x', sprite.x),
    number('pos.y', sprite.y),
    number('rotation', sprite.rotation),
    number('scale.x', sprite.scale.x),
    number('scale.y', sprite.scale.y),
    number('alpha', sprite.alpha),
    number('anchor.x', sprite.anchor.x),
    number('anchor.y', sprite.anchor.y),
    number('pivot.x', sprite.pivot.x),
    number('pivot.y', sprite.pivot.y),
    number('skew.x', sprite.skew.x),
    number('skew.y', sprite.skew.y),
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
    number('scale.x', t.scale.x),
    number('scale.y', t.scale.y),
    number('alpha', t.alpha),
    number('anchor.x', t.anchor.x),
    number('anchor.y', t.anchor.y),
    number('pivot.x', t.pivot.x),
    number('pivot.y', t.pivot.y),
    number('skew.x', t.skew.x),
    number('skew.y', t.skew.y),
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
