export default {
  view: function(c, args) {
    return m('input[type=text]', {
      config: function(el, init, ctx) {
        // Data down
        if (ctx.oldValue !== args.value) {
          el.value = ctx.oldValue = args.value;
        }
      },
      onmousedown: function(e) {
        if (args.showAssetBrowser) {
          args.showAssetBrowser(function(key) {
            this.value = key;
            args.onchange && args.onchange(this.value);
          }.bind(this));
        }

        // Manually blur this input, so that keyboard shortcuts won't
        // change its value
        setTimeout(function() {
          e.target.blur();
        }, 20);
      }
    });
  }
};
