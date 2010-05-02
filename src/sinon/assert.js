/**
 * @depend ../sinon.js
 * @depend stub.js
 */
/*jslint indent: 2, eqeqeq: false, onevar: false, nomen: false*/
/*global module, require, sinon*/
(function (sinon) {
  var commonJSModule = typeof module == "object" && typeof require == "function";

  if (!sinon && commonJSModule) {
    sinon = require("sinon");
  }

  if (!sinon) {
    return;
  }

  function fail(message) {
    var error = new Error(message);
    error.name = this.failException || sinon.assert.failException;
    throw error;
  }

  function verifyIsStub(method) {
    if (typeof method != "function") {
      this.fail(method + " is not a function");
    }

    if (typeof method.called != "function") {
      this.fail(method + " is not stubbed");
    }
  }

  function failAssertion(object, msg) {
    var failMethod = object.fail || sinon.assert.fail;
    failMethod.call(object, msg);
  }

  function assertCalled(method) {
    verifyIsStub.call(this, method);

    if (!method.called()) {
      failAssertion(this, "fake was not called as expected");
    }
  }

  function assertCalledOn(thisObj, method) {
    verifyIsStub.call(this, method);

    if (!method.calledOn(thisObj)) {
      failAssertion(this, method + " was not called with " + thisObj + " as this");
    }
  }

  function assertCalledWith(method) {
    verifyIsStub.call(this, method);
    var args = Array.prototype.slice.call(arguments, 1);

    if (!method.calledWith.apply(method, args)) {
      failAssertion(this, method + " was not called with arguments " + args.join());
    }
  }

  function assertCalledWithExactly(method) {
    verifyIsStub.call(this, method);
    var args = Array.prototype.slice.call(arguments, 1);

    if (!method.calledWithExactly.apply(method, args)) {
      failAssertion(this, method + " was not called with exact arguments " + args.join());
    }
  }

  function assertThrew(method, exception, message) {
    verifyIsStub.call(this, method);

    if (!method.threw(exception, message)) {
      failAssertion(this, method + " did not throw exception");
    }
  }

  function assertCallCount(count, method) {
    verifyIsStub.call(this, method);

    if (method.callCount() != count) {
      failAssertion(this, method + " was not called " + count + " times");
    }
  }

  function expose(target, prefix, includeFail) {
    if (!target) {
      throw new TypeError("target is null or undefined");
    }

    var addPrefix = typeof prefix == "undefined" ? true : !!prefix;

    var name = function (prop) {
      if (!addPrefix) {
        return prop;
      }

      return "assert" + prop.substring(0, 1).toUpperCase() + prop.substring(1);
    };

    for (var assert in this) {
      if (!/^(fail|expose)/.test(assert)) {
        target[name(assert)] = this[assert];
      }
    }

    if (typeof includeFail == "undefined" || !!includeFail) {
      target.fail = this.fail;
      target.failException = this.failException;
    }

    return target;
  }

  sinon.assert = {
    fail: fail,
    failException: "AssertError",
    called: assertCalled,
    calledOn: assertCalledOn,
    calledWith: assertCalledWith,
    calledWithExactly: assertCalledWithExactly,
    threw: assertThrew,
    callCount: assertCallCount,
    expose: expose
  };
}(typeof sinon == "object" && sinon || null));
