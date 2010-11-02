/*jslint indent: 2*/
/*global sinon, QUnit, test*/
sinon.assert.fail = function (msg) {
  QUnit.ok(false, msg);
};

sinon.config = {
  injectIntoThis: true,
  injectInto: null,
  properties: ["spy", "stub", "mock", "clock", "sandbox"],
  useFakeTimers: true,
  useFakeServer: false
};

(function () {
  var qTest = QUnit.test;

  QUnit.test = test = function (testName, expected, callback, async) {
    if (arguments.length === 2) {
      callback = expected;
      expected = null;
    }

    return qTest(testName, expected, sinon.test(callback), async);
  };
}());
