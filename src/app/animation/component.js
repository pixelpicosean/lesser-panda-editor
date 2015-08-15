export default {
  controller: function() {
    let ctrl = {};

    return ctrl;
  },
  view: function(ctrl) {
    return m('div.anim-editor', [
      m('div.anim-editor-upper', [
        m('section.sprite-selector', 'Sprite Selector'),
        m('section.anim-preview', 'Anim Preview')
      ]),
      m('div.anim-editor-lower', [
        m('div.anim-list', [
          m('header.anim-list-header', 'ANIMATIONS'),
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
        m('div.anim-settings', [
          m('header.anim-settings-header', 'SETTINGS'),
          m('ul.anim-settings-container', [
            m('li.anim-settings-item', 'Speed'),
            m('li.anim-settings-item', 'Loop')
          ])
        ]),
        m('div.anim-sequence', [
          m('div.anim-sequence-controls', [
            m('a.anim-sequence-controls-play', 'PLAY')
          ]),
          m('ul.anim-sequence-editor', [
            m('li.anim-sequence-editor-frame', 'A'),
            m('li.anim-sequence-editor-frame', 'B'),
            m('li.anim-sequence-editor-frame', 'C'),
            m('li.anim-sequence-editor-frame', 'D'),
            m('li.anim-sequence-editor-frame', 'E'),
            m('li.anim-sequence-editor-frame', 'F'),
            m('li.anim-sequence-editor-frame', 'G')
          ])
        ])
      ])
    ]);
  }
};
