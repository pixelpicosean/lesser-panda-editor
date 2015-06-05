import flyd from 'flyd';

import Actor from '../actor/actor';

const attr = flyd.stream;

var Sprite = function(name, x, y, texture = '') {
  Actor.call(this, name, x, y);

  this.nodeType = 'Sprite';

  this.rotation = attr(0);
  this.scale = {
    x: attr(1),
    y: attr(1)
  };
  this.alpha = attr(1);
  this.anchor = {
    x: attr(0),
    y: attr(0)
  };

  this.texture = attr(texture);
};
Sprite.prototype = Object.create(Actor.prototype);
Sprite.prototype.constructor = Actor;

export default Sprite;
