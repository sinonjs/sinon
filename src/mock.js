(function () {
  if (typeof sinon == "undefined" || !sinon.stub || !sinon.spy) {
    return;
  }

  var mock = (function () {
    function create (object) {
      if (!object || typeof object != "object") {
        throw new TypeError("Provide object to mock");
      }

      var mockObject = Object.create(mock);
      mockObject.object = object;

      return mockObject;
    }

    function expects (method) {
      if (!method) {
        throw new TypeError("Needs method");
      }

      if (!this.expectations) {
        this.expectations = [];
      }

      var expectation = sinon.stub(this.object, method);
      this.expectations.push(expectation);

      return expectation;
    }

    return {
      create: create,
      expects: expects
    };
  }());

  

  sinon.mock = mock;
}());
