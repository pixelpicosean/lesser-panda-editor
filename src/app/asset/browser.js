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
      m('ul.asset-list', [
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details', '1')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details', '2')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details', '3')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details', '4')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details', '5')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details', '6')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details', '7')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details', '8')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details', '9')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','10')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','11')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','12')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','13')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','10')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','11')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','12')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','13')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','10')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','11')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','12')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','13')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','10')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','11')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','12')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','13')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','10')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','11')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','12')
        ]),
        m('li.asset-item', [
          m('div.thumbnail'),
          m('div.details','13')
        ])
      ])
    ]);
  }
};
