import flyd from 'flyd';

const attr = flyd.stream;

var Actor = function(name = 'Untitled', x = 0, y = 0) {
  this.id = Actor.uid++;

  this.name = attr(name);
  this.position = {
    x: attr(x),
    y: attr(y)
  };

  this.parent = attr();
  this.children = [];
};
Actor.prototype.addChild = function(child) {
  if (this.children.indexOf(child) === -1) {
    child.parent() && child.parent().removeChild(child);

    child.parent(this);
    this.children.push(child);
  }
};
Actor.prototype.removeChild = function(child) {
  var idx = this.children.indexOf(child);
  if (idx !== -1) {
    child.parent();
    this.children.splice(idx, 1);
  }
};
Actor.uid = 0;

export default Actor;
