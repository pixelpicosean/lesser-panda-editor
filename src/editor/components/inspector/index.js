import h from 'snabbdom/h';

import css from './style.css';

import { models } from 'editor/model';

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

const viewTypes = { readonly, text, number, boolean: text };

const prop2View = (prop, state) => {
  if (prop.readonly) {
    return readonly(prop.key, state);
  }
  else {
    return viewTypes[prop.type](prop.key, state);
  }
};

const view = (obj, op) => {
  if (viewTypes.hasOwnProperty(obj.type)) {
    return models[obj.type].props.map((p) => prop2View(p, obj[p.key]));
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
    h(`ul.${css.tree}`, obj ? view(obj) : EMPTY),
  ]);
};
