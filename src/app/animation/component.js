export default {
  controller: function() {
    let ctrl = {
      framesRenderer: null,

      updateFrames: function(el, initialized) {
        if (initialized) {
          ctrl.renderFrames();
        }
        else {
          ctrl.initFramesView(el);
        }
      },

      initFramesView: function(el) {
        var w = el.offsetWidth;
        var h = el.offsetHeight;
        ctrl.framesRenderer = PIXI.autoDetectRenderer(w, h, {
          view: el,
          resolution: window.devicePixelRatio
        });

        // el.style.width = w + 'px';
        // el.style.height = h + 'px';
      },
      renderFrames: function() {}
    };

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
          m('canvas.anim-sequence-editor[width=20,height=20]', { config: ctrl.updateFrames })
        ])
      ])
    ]);
  }
};
