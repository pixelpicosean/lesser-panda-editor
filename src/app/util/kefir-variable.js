export default function(value) {
  var emitter;
  var prop = Kefir.stream(function(e) {
    emitter = e;
  }).toProperty();

  var foo = function(newVal) {
    if (arguments.length === 0) {
      return foo.val;
    }
    else {
      foo.val = newVal;
      emitter && emitter.emit(foo.val);
    }
  };

  foo.val = value;
  foo.prop = prop;

  foo.onValue = function(f) {
    prop.onValue(f);
  };
  foo.offValue = function(f) {
    prop.offValue(f);
  };
  foo.log = function() {
    prop.log();
  };
  foo.offLog = function() {
    prop.offLog();
  };

  return foo;
};
