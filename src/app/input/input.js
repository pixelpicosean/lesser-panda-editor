import m from 'mithril';

export default function(type, value, changeHandler) {
  return m('input[type=' + type + ']', {
    config: function(el, init, ctx) {
      if (ctx.val && ctx.val === value) {
        return;
      }
      else {
        ctx.val = value;
        el.value = value();
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
      changeHandler && changeHandler(this.value);
    },
    onmouseup: function() {
      // Prevent deselect on focus
      return false;
    }
  });
};
