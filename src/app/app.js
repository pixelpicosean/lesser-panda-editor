let Editor = {
  controller: function() {
    return {
      title: 'CIRCULUS EDITOR'
    };
  },
  view: function(ctrl) {
    return m('h1', ctrl.title);
  }
};

m.mount(document.querySelector('#app'), Editor);
