import m from 'mithril';
import input from '../input/input';

export default {
  controller: function(args) {
    let c = {
      actor: args.actor,

      nameChanged: function(name) { c.actor().name(name); args.whenModelChanged({ key: 'name', value: name }); },

      posXChanged: function(x) { c.actor().position.x(x); args.whenModelChanged({ key: 'position.x', value: x }); },
      posYChanged: function(y) { c.actor().position.y(y); args.whenModelChanged({ key: 'position.y', value: y }); }
    };
    return c;
  },
  view: function(controller) {
    return m('aside.sidebar.right.shadow', [
      m('header.header', 'Inspector'),
      m('div.content.y-overflow', [
        // Actor
        m('h2', 'GENERAL'),
        m('div.property-edit', [
          m('label', 'Name'),
          input('text', controller.actor().name, controller.nameChanged)
        ]),

        m('div.property-edit', [
          m('label', 'Position'),
          input('number', controller.actor().position.x, controller.posXChanged),
          input('number', controller.actor().position.y, controller.posYChanged)
        ])
      ])
    ]);
  }
};
