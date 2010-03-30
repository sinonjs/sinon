(function () {
  function stub (object, property, func) {
    if (!!func && typeof func != "function") {
      throw new TypeError("Custom stub should be function");
    }

    var wrapper;

    if (func) {
      wrapper = sinon.spy && sinon.spy.create ? sinon.spy.create(func) : func;
    } else {
      wrapper = stub.create();
    }

    return sinon.wrapMethod(object, property, wrapper);
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
