var sinon = (function () {
  function wrapMethod (object, property, method) {
    if (!object) {
      throw new TypeError("Should wrap property of object");
    }

    if (typeof method != "function") {
      throw new TypeError("Method wrapper should be function");
    }

    var wrappedMethod = object[property];
    var type = typeof wrappedMethod;

    if (!!wrappedMethod && type != "function") {
      throw new TypeError("Attempted to wrap " + type + " as function");
    }

    object[property] = method;

    method.restore = function () {
      object[property] = wrappedMethod;
    };

    return method;
  }

  return {
    wrapMethod: wrapMethod
  };
}());
