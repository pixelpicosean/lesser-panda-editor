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
        m('ul.anim-list', [
          m('li.anim-list-item', 'idle'),
          m('li.anim-list-item', 'run'),
          m('li.anim-list-item', 'jump')
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
            m('li.anim-sequence-editor-frame', '0'),
            m('li.anim-sequence-editor-frame', '1'),
            m('li.anim-sequence-editor-frame', '2'),
            m('li.anim-sequence-editor-frame', '3'),
            m('li.anim-sequence-editor-frame', '4')
          ])
        ])
      ])
    ]);
  }
};
