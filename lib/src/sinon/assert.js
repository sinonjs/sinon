/**
 * @depend ../sinon.js
 * @depend stub.js
 */
/*jslint indent: 2, eqeqeq: false, onevar: false, nomen: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Assertions matching the test spy retrieval interface.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
(function (sinon) {
  var commonJSModule = typeof module == "object" && typeof require == "function";
  var slice = Array.prototype.slice;
  var assert;

  if (!sinon && commonJSModule) {
    sinon = require("sinon");
  }

  if (!sinon) {
    return;
  }

  function verifyIsStub(method) {
    if (typeof method != "function") {
      assert.fail(method + " is not a function");
    }

    if (typeof method.getCall != "function") {
      assert.fail(method + " is not stubbed");
    }
  }

  function failAssertion(object, msg) {
    var failMethod = object.fail || assert.fail;
    failMethod.call(object, msg);
  }

  function mirrorAssertion(method, message) {
    assert[method] = function (fake) {
      verifyIsStub(fake);

      if (!fake[method].apply(fake, slice.call(arguments, 1))) {
        for (var i = 0, l = arguments.length; i < l; i++) {
          message = message.replace("%" + i, arguments[i]);
        }

        failAssertion(this, message);
      }
    };
  }

  assert = {
    failException: "AssertError",

    fail: function fail(message) {
      var error = new Error(message);
      error.name = this.failException || assert.failException;
      throw error;
    },

    called: function assertCalled(method) {
      verifyIsStub(method);

      if (!method.called) {
        failAssertion(this, "fake was not called as expected");
      }
    },

    callOrder: function assertCallOrder() {
      verifyIsStub(arguments[0]);

      for (var i = 1, l = arguments.length; i < l; i++) {
        verifyIsStub(arguments[i]);

        if (!arguments[i - 1].calledBefore(arguments[i])) {
          failAssertion(this, "fakes were not called in expected order");
        }
      }
    },

    callCount: function assertCallCount(method, count) {
      verifyIsStub(method);

      if (method.callCount != count) {
        failAssertion(this, method + " was not called " + count + " times");
      }
    },

    expose: function expose(target, prefix, includeFail) {
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
  };

  mirrorAssertion("calledOn", "%0 was not called with %1 as this");
  mirrorAssertion("alwaysCalledOn", "%0 was not always called with %1 as this");
  mirrorAssertion("calledWith", "%0 was not called with arguments %1");
  mirrorAssertion("alwaysCalledWith", "%0 was not always called with arguments %1");
  mirrorAssertion("calledWithExactly", "%0 was not called with exact arguments %1");
  mirrorAssertion("alwaysCalledWithExactly", "%0 was not always called with exact arguments %1");
  mirrorAssertion("threw", "%0 did not throw exception");
  mirrorAssertion("alwaysThrew", "%0 did not always throw exception");

  if (commonJSModule) {
    module.exports = assert;
  } else {
    sinon.assert = assert;
  }
}(typeof sinon == "object" && sinon || null));
