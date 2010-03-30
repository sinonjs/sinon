TestCase("MockTest", {
  "test should be object": function () {
    assertObject(sinon.mock);
  }
});

TestCase("MockCreateTest", {
  "test should be function": function () {
    assertFunction(sinon.mock.create);
  },

  "test should throw if first argument is not passed": function () {
    assertException(function () {
      sinon.mock.create();
    }, "TypeError");
  },

  "test should throw if first argument is not object": function () {
    assertException(function () {
      sinon.mock.create(function () {});
    }, "TypeError");
  },

  "test should return mock object": function () {
    var mock = sinon.mock.create({});

    assertObject(mock);
    assert(sinon.mock.isPrototypeOf(mock));
  }
});

TestCase("MockExpectTest", {
  setUp: function () {
    this.method = function () {};
    this.object = { method: this.method };
    this.mock = sinon.mock.create(this.object);
  },

  "test should be function": function () {
    assertFunction(this.mock.expects);
  },

  "test should throw without property": function () {
    var mock = this.mock;

    assertException(function () {
      mock.expects();
    }, "TypeError");
  },

  "test should return function": function () {
    assertFunction(this.mock.expects("someMeth"));
  }
});
