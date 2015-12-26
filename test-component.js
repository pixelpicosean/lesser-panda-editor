import snabbdom from './snabbdom';
import h from './snabbdom/h';
import EventEmitter from 'engine/eventemitter3';
import R from 'engine/reactive';

const patch = snabbdom.init([
  require('./snabbdom/modules/class'),
  require('./snabbdom/modules/props'),
  require('./snabbdom/modules/style'),
  require('./snabbdom/modules/eventlisteners'),
]);

const events = new EventEmitter();

// View
const vnode =
  h('div#container', {on: {click: () => events.emit('start')}}, [
    h('span', {style: {fontWeight: 'bold'}}, 'LesserPanda Editor'),
  ]);

// Streams
const tryToStart$ = R.fromEvents(events, 'start');
const startTime$ = tryToStart$.scan(total => total + 1, 0);

startTime$.onValue(time => {
  console.log(`start ${time} times`);
});

export default container => patch(container, vnode);
