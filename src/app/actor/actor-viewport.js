import flyd from 'flyd';
import m from 'mithril';

export default {
  controller: function(args) {
    let controller = {
      canvas: null,
      context: null,

      actor: args.actor,

      config: function(element, isInitialized, ctx) {
        // Don't redraw if we did once already.
        if (isInitialized) return;

        // Initialize stuff
        controller.canvas = element;
        controller.context = element.getContext('2d');

        // Setup event stream and handlers
        let viewSizeChanged = flyd.stream();
        window.addEventListener('resize', viewSizeChanged);

        let whenToDraw = flyd.merge(viewSizeChanged, args.actorAttrChanged);

        flyd.map(controller.resize, viewSizeChanged);
        flyd.map(controller.draw, whenToDraw);

        // Unload behavior
        controller.onunload = function() {
          window.removeEventListener('resize', viewSizeChanged);
        };

        // Resize canvas and draw the first time
        controller.resize();
        controller.draw();
      },

      resize: function() {
        var w = controller.canvas.clientWidth;
        var h = controller.canvas.clientHeight;

        var pixelRatio = window.devicePixelRatio;

        controller.canvas.width = w * pixelRatio;
        controller.canvas.height = h * pixelRatio;
      },
      draw: function() {
        controller.context.clearRect(0, 0, controller.canvas.width, controller.canvas.height);

        controller.drawActor(controller.actor());
      },
      drawActor: function(actor) {
        if (!actor) return;

        controller.context.font = '32px Roboto';
        controller.context.fillStyle = '#cddc39';
        controller.context.fillText(actor.name(), actor.position.x(), actor.position.y());

        actor.children.forEach(controller.drawActor);
      }
    };

    return controller;
  },
  view: function(controller) {
    return m('canvas#viewport.max-size', { config: controller.config });
  }
};
