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

        ctrl.framesContainer = new PIXI.Container();

        var rect, frame;
        for (var i = 0; i < 6; i++) {
          rect = new PIXI.Graphics();
          rect.beginFill(0xffc107);
          rect.drawRect(0, 0, 40, 60);
          rect.endFill();

          rect.position.set(20 + i * 50, 20);

          frame = new PIXI.Text(i + 1 + '', {
            font: '24px Verdana',
            fill: 'white'
          });
          frame.position.set(20 - frame.width * 0.5, 14);
          rect.addChild(frame);

          ctrl.framesContainer.addChild(rect);
        }

        ctrl.renderFrames();
      },
      renderFrames: function() {
        ctrl.framesRenderer.render(ctrl.framesContainer);
      }
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
          m('canvas.anim-sequence-editor', { config: ctrl.updateFrames })
        ])
      ])
    ]);
  }
};
