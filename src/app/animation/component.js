export default {
  controller: function() {

  },
  view: function(ctrl) {
    return m('div.anim-editor', [
      m('div.anim-editor-upper', [
        m('section.sprite-selector', 'Sprite Selector'),
        m('section.anim-preview', 'Anim Preview')
      ]),
      m('div.anim-editor-lower', [
        m('div.anim-list', [
          m('header.anim-list-header', 'Animations'),
          m('ul.anim-list-container', [
            m('li.anim-list-item', 'idle'),
            m('li.anim-list-item', 'run'),
            m('li.anim-list-item.is-selected', 'jump'),
            m('li.anim-list-item', 'walk'),
            m('li.anim-list-item', 'fly'),
            m('li.anim-list-item', 'dash'),
            m('li.anim-list-item', 'fall'),
            m('li.anim-list-item', 'die'),
            m('li.anim-list-item', 'born')
          ])
        ]),
        m('ul.anim-settings', [
          m('li.anim-settings-item', 'Speed'),
          m('li.anim-settings-item', 'Loop')
        ]),
        m('div.anim-sequence', [
          m('div.anim-sequence-controls', [
            m('a.anim-sequence-controls-play', 'Play')
          ]),
          m('ul.anim-sequence-editor', [
            m('li.anim-sequence-editor-item', '0'),
            m('li.anim-sequence-editor-item', '1'),
            m('li.anim-sequence-editor-item', '2'),
            m('li.anim-sequence-editor-item', '3'),
            m('li.anim-sequence-editor-item', '4')
          ])
        ])
      ])
    ]);
  }
};
