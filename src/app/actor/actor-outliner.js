import flyd from 'flyd';
import m from 'mithril';

export default {
  controller: function(args) {
    let c = {
      actor: args.actor(),
      selectedId: args.actor().id,

      select: function(actor) {
        args.selected(actor);
        // console.log('[Outliner] select: %s', actor.name());
      }
    };

    flyd.map(function(selected) {
      c.selectedId = selected.id;
    }, args.selected);

    return c;
  },
  view: function(controller) {
    return m('aside.sidebar.left.shadow', [
      m('header.header', 'Outliner'),
      m('ul.content.tree.y-overflow', [
        m('li', [
          m('div.leaf' + (controller.selectedId === controller.actor.id ? '.selected' : ''), [
            m('label', controller.actor.name()),
          ]),
          m('ul.list', controller.actor.children.map(function mapActorRecursive(actor) {
            return m('li', [
              m('div.leaf' + (controller.selectedId === actor.id ? '.selected' : ''), { onmousedown: controller.select.bind(controller, actor) }, [
                m('label', actor.name()),
              ]),
              m('ul.list', actor.children.map(mapActorRecursive))
            ]);
          }))
        ])
      ])
    ]);
  }
};
