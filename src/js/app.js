import m from 'mithril';
import AnimationEditor from './animation/component';

let Editor = {
  view: function() {
    return m.component(AnimationEditor);
  }
};

m.mount(document.querySelector('#app'), Editor);
