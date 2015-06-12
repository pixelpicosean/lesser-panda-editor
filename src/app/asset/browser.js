import m from 'mithril';
import SearchInput from '../input/search-input';

export default {
  view: function(c, args) {
    return m('div.asset-browser', [
      m('header', [
        m('h2', 'Asset Browser'),
        m.component(SearchInput, {})
      ]),
      m('ul.asset-list', (PIXI.FrameCache && PIXI.FrameCache.map) ?
        PIXI.FrameCache.map(function(f) {
          return m('li.asset-item', { onclick: args.onselect.bind(c, f.key) }, [
            m('img.thumbnail', { src: f.url }),
            m('div.details', f.key)
          ]);
        }) : ''
      )
    ]);
  }
};
