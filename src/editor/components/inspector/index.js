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
    readonly('type', type),
    text('name', name),
    number('x', x),
    number('y', y),
    number('rotation', rotation),
    number('scale.x', scale.x),
    number('scale.y', scale.y),
    number('alpha', alpha),
    number('pivot.x', pivot.x),
    number('pivot.y', pivot.y),
    number('skew.x', skew.x),
    number('skew.y', skew.y),
    // toggle('visible', true),
  ]),

  sprite: (sprite, op) => ([
    readonly('type', sprite.type),
    text('name', sprite.name),
    number('x', sprite.x),
    number('y', sprite.y),
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

  text: (t, op) => ([
    readonly('type', t.type),
    text('name', t.name),
    text('text', t.text),
    text('style.font', t.style.font),
    text('style.fill', t.style.fill),
    number('x', t.x),
    number('y', t.y),
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
  let obj, idx = model.context.selected;
  if (idx !== -1) {
    obj = model.data.objects[idx];
  }

  return h(`section.${css.inspector}`, [
    h('header', 'INSPECTOR'),
    h(`ul.${css.tree}`, obj ? view(obj, op) : EMPTY),
  ]);
};
