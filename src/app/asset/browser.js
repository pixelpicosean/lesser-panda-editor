import m from 'mithril';
import SearchInput from '../input/search-input';

export default {
  constroller: function(args) {},
  view: function(c, args) {
    return m('div.asset-browser', [
      m('header', [
        m('h2', 'Asset Browser'),
        m.component(SearchInput, {})
      ]),
      m('ul.asset-list', (PIXI.FrameCache && PIXI.FrameCache.map) ?
        PIXI.FrameCache.map(function(f) {
          return m('li.asset-item', [
            m('img.thumbnail', { src: f.url }),
            m('div.details', f.key)
          ]);
        }) : ''
      )
    ]);
  }
};
