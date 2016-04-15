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
  Container: (c, op) =>([
    readonly('type', c.get('type')),
    text('name', c.get('name')),
    number('x', c.get('x')),
    number('y', c.get('y')),
    number('rotation', c.get('rotation')),
    number('scale.x', c.get('scale').get('x')),
    number('scale.y', c.get('scale').get('y')),
    number('alpha', c.get('alpha')),
    number('pivot.x', c.get('pivot').get('x')),
    number('pivot.y', c.get('pivot').get('y')),
    number('skew.x', c.get('skew').get('x')),
    number('skew.y', c.get('skew').get('y')),
    // toggle('visible', true),
  ]),

  Sprite: (sprite, op) => ([
    readonly('type', sprite.get('type')),
    text('name', sprite.get('name')),
    number('x', sprite.get('x')),
    number('y', sprite.get('y')),
    number('rotation', sprite.get('rotation')),
    number('scale.x', sprite.get('scale').get('x')),
    number('scale.y', sprite.get('scale').get('y')),
    number('alpha', sprite.get('alpha')),
    number('anchor.x', sprite.get('anchor').get('x')),
    number('anchor.y', sprite.get('anchor').get('y')),
    number('pivot.x', sprite.get('pivot').get('x')),
    number('pivot.y', sprite.get('pivot').get('y')),
    number('skew.x', sprite.get('skew').get('x')),
    number('skew.y', sprite.get('skew').get('y')),
    // toggle('visible', true),
  ]),

  Text: (t, op) => ([
    readonly('type', t.get('type')),
    text('name', t.get('name')),
    text('text', t.get('text')),
    text('style.font', t.get('style').get('font')),
    text('style.fill', t.get('style').get('fill')),
    number('x', t.get('x')),
    number('y', t.get('y')),
    number('rotation', t.get('rotation')),
    number('scale.x', t.get('scale').get('x')),
    number('scale.y', t.get('scale').get('y')),
    number('alpha', t.get('alpha')),
    number('anchor.x', t.get('anchor').get('x')),
    number('anchor.y', t.get('anchor').get('y')),
    number('pivot.x', t.get('pivot').get('x')),
    number('pivot.y', t.get('pivot').get('y')),
    number('skew.x', t.get('skew').get('x')),
    number('skew.y', t.get('skew').get('y')),
    // toggle('visible', true),
  ]),
};

const view = (obj, op) => {
  if (views.hasOwnProperty(obj.get('type'))) {
    return views[obj.get('type')](obj, op);
  }
};

export default (model, op) => {
  operate = op;
  let obj, path = model.getIn(['context', 'selected']);
  if (path) {
    obj = model.getIn(path);
  }

  return h(`section.${css.inspector}`, [
    h('header', 'INSPECTOR'),
    h(`ul.${css.tree}`, obj ? view(obj, op) : EMPTY),
  ]);
};
