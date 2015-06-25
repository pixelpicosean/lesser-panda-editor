export default {
  view: function(c, args) {
    return m('div.search', [
      m('span.fa.fa-search'),
      m('input[type=text]', {
        config: function(el, init, ctx) {
          // Data down
          if (ctx.oldValue !== args.value) {
            el.value = ctx.oldValue = args.value;
          }
        },
        onkeydown: function(e) {
          if (e.keyCode === 13) {
            this.blur();
          }
        },
        onfocus: function() {
          this.select();
        },
        onblur: function() {
          // Action up
          args.onchange && args.onchange(this.value);
        },
        onmouseup: function() {
          // Prevent deselect on focus
          return false;
        },
        placeholder: 'Search'
      })
    ]);
  }
};
