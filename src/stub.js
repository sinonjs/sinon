(function () {
  function stub (object, property, func) {
    if (!object) {
      throw new TypeError("Should stub property of object");
    }

    if (!!func && typeof func != "function") {
      throw new TypeError("Custom stub should be function");
    }

    var method = object[property];
    var type = typeof method;

    if (!!method && type != "function") {
      throw new TypeError("Attempted to stub " + type + " as function");
    }

    if (typeof func == "function") {
      object[property] = !!sinon.spy ? sinon.spy(func) : func;
    } else {
      object[property] = stub.create();
    }

    object[property].restore = function () {
      object[property] = method;
    };

    return object[property];
  }

  Object.extend(stub, (function () {
    function create () {
      function functionStub () {
        if (functionStub.exception) {
          throw functionStub.exception;
        }

        return functionStub.returnValue;
      }

      Object.extend(functionStub, stub);

      if (sinon.spy) {
        Object.extend(functionStub, sinon.spy);
      }

      return functionStub;
    }

    function returns (value) {
      this.returnValue = value;

      return this;
    }

    function throws (error, message) {
      if (typeof error == "string") {
        this.exception = new Error(message);
        this.exception.name = error;
      } else {
        this.exception = error;
      }

      return this;
    }

    return {
      create: create,
      returns: returns,
      throws: throws
    };
  }()));

  if (typeof sinon == "object") {
    sinon.stub = stub;
  }
}());
