import attr from '../util/kefir-variable';

import Actor from '../actor/actor';

var Sprite = function(name, x, y, texture = '') {
  Actor.call(this, name, x, y);

  this.nodeType = 'Sprite';

  this.alpha = attr(1);
  this.blendMode = attr('NORMAL');
  this.tint = attr('0x000000');
  this.scale = {
    x: attr(1),
    y: attr(1)
  };
  this.rotation = attr(0);
  this.anchor = {
    x: attr(0),
    y: attr(0)
  };
  this.pivot = {
    x: attr(0),
    y: attr(0)
  };

  this.texture = attr(texture);
};
Sprite.prototype = Object.create(Actor.prototype);
Sprite.prototype.constructor = Actor;

export default Sprite;
