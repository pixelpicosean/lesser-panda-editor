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
  'sprite': (sprite, op) => ([
    readonly('type', sprite.type),
    text('name', sprite.name),
    number('pos.x', 100),
    number('pos.y', 64),
    number('rotation', 0),
    number('scale.x', 1),
    number('scale.y', 1),
    number('alpha', 1),
    number('anchor.x', 0),
    number('anchor.y', 0),
    number('pivot.x', 0),
    number('pivot.y', 0),
    number('skew.x', 0),
    number('skew.y', 0),
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
