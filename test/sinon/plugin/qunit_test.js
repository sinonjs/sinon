testCase("SinonQUnitTest", {
  setUp: function () {
    sinon.spy(QUnit, "ok");
  },

  tearDown: function () {
    if (sinon.test.restore) {
      sinon.test.restore();
    }

    QUnit.originalTest.callCount = 0;
    QUnit.originalTest.args = [];
    QUnit.ok.restore();
  },

  "fail should fail through ok": function () {
    sinon.assert.fail("Uh-oh!");

    assert(QUnit.ok.calledOnce);
    assert(QUnit.ok.calledWithExactly(false, "Uh-oh!"));
  },

  "should pass callback to sinon.test": function () {
    sinon.spy(sinon, "test");
    var func = function () {};
    test("Test", func);

    assert(sinon.test.calledOnce);
    assert(sinon.test.calledWith(func));
  },

  "should pass name and sandboxed callback to QUnit": function () {
    var sandboxed = function () {};
    sinon.stub(sinon, "test").returns(sandboxed);
    QUnit.test("Test", function () {});

    assert(QUnit.originalTest.calledOnce);
    assert(QUnit.originalTest.calledWith("Test", null, sandboxed, undefined));
  },

  "should pass name, expected and sandboxed callback to QUnit": function () {
    var sandboxed = function () {};
    sinon.stub(sinon, "test").returns(sandboxed);
    QUnit.test("Test This", 23, function () {});

    assert(QUnit.originalTest.calledWith("Test This", 23, sandboxed, undefined));
  },

  "should pass name, env and sandboxed callback to QUnit": function () {
    var sandboxed = function () {};
    var env = { id: 42 };
    sinon.stub(sinon, "test").returns(sandboxed);
    QUnit.test("Test This", env, function () {});

    assert(QUnit.originalTest.calledWith("Test This", env, sandboxed, undefined));
  },

  "should pass name, env, sandboxed callback and async to QUnit": function () {
    var sandboxed = function () {};
    var env = { id: 42 };
    sinon.stub(sinon, "test").returns(sandboxed);
    QUnit.test("Test This", env, function () {}, true);

    assert(QUnit.originalTest.calledWith("Test This", env, sandboxed, true));
  },

  "should pass name, expected, sandboxed callback and async to QUnit": function () {
    var sandboxed = function () {};
    sinon.stub(sinon, "test").returns(sandboxed);
    QUnit.test("Test This", 42, function () {}, true);

    assert(QUnit.originalTest.calledWith("Test This", 42, sandboxed, true));
  }
});