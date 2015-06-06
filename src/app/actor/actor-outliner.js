import m from 'mithril';

export default {
  controller: function(args) {
    let c = {
      // = Attributes =====================================

      actor: args.actor,
      selected: args.selected,

      isSelected: function(actor) {
        return actor.id === args.selected().id;
      },

      // = Actions ========================================

      selectChild: function(actor) {
        args.selected(actor);
        // console.log('[Outliner] select: %s', actor.name());
      }
    };

    return c;
  },
  view: function(controller) {
    // console.log('[Outliner] view');
    return m('aside.sidebar.left.shadow', [
      m('header.header', 'Outliner'),
      m('ul.content.tree.y-overflow', [
        m('li', [
          m('div.leaf' + (controller.isSelected(controller.actor()) ? '.selected' : ''), { onmousedown: controller.selectChild.bind(controller, controller.actor()) }, [
            m('label', controller.actor().name()),
          ]),
          m('ul.list', controller.actor().children.map(function childTreeMap(actor) {
            return m('li', [
              m('div.leaf' + (controller.isSelected(actor) ? '.selected' : ''), { onmousedown: controller.selectChild.bind(controller, actor) }, [
                m('label', actor.name()),
              ]),
              m('ul.list', actor.children.map(childTreeMap))
            ]);
          }))
        ])
      ])
    ]);
  }
};
