import h from 'editor/snabbdom/h';

import css from './style.css';

// View
const EMPTY = [];
let operate;

const readonly = (key, value) => h(`div.${css.prop}`, [
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

const text = (key, value) => h(`div.${css.prop}`, [
  h(`div.${css.key}`, key),
  h(`input.${css.value}.${css.text}`, {
    props: {
      type: 'text',
      value: value,
    },
  }),
]);

const number = (key, value) => h(`div.${css.prop}`, [
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
    number('x', 100),
    number('y', 64),
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
