/**
  @class AnimationData
  @constructor
  @param {Array} frames
  @param {Object} [props]
**/
function AnimationData(frames, props) {
  /**
    Is animation looping.
    @property {Boolean} loop
    @default true
  **/
  this.loop = true;
  /**
    Play animation in random order.
    @property {Boolean} random
    @default false
  **/
  this.random = false;
  /**
    Play animation in reverse.
    @property {Boolean} reverse
    @default false
  **/
  this.reverse = false;
  /**
    Speed of animation (frames per second).
    @property {Number} speed
    @default 10
  **/
  this.speed = 10;
  /**
    Animation frame order.
    @property {Array} frames
  **/
  this.frames = frames;

  Object.assign(this, props);
}

function animationData() {

}

function Animation() {
  this.anims = {};
}
