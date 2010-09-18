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

  function times(count) {
    return count == 1 && "once" ||
           count == 2 && "twice" ||
           count == 3 && "thrice" ||
           (count || 0) + " times";
  }

  function verifyIsStub(method) {
    if (!method) {
      assert.fail("fake is not a spy");
    }

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

      var failed = typeof fake[method] == "function" ?
        !fake[method].apply(fake, slice.call(arguments, 1)) : !fake[method];

      if (failed) {
        var msg = message.replace("%c", times(fake.callCount));
        msg = msg.replace("%n", fake + "");
        msg = msg.replace("%*", [].slice.call(arguments, 1).join(", "));

        for (var i = 0, l = arguments.length; i < l; i++) {
          msg = msg.replace("%" + i, arguments[i]);
        }

        failAssertion(this, msg);
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
        failAssertion(this, "expected " + method +
                      " to have been called at least once but was never called");
      }
    },

    notCalled: function assertNotCalled(method) {
      verifyIsStub(method);

      if (method.called) {
        failAssertion(this, "expected " + method + " to not have been called " +
                      "but was called " + times(method.callCount));
      }
    },

    callOrder: function assertCallOrder() {
      verifyIsStub(arguments[0]);
      var expected = [];
      var actual = [];
      var failed = false;
      expected.push(arguments[0]);

      for (var i = 1, l = arguments.length; i < l; i++) {
        verifyIsStub(arguments[i]);
        expected.push(arguments[i]);

        if (!arguments[i - 1].calledBefore(arguments[i])) {
          failed = true;
        }
      }

      if (failed) {
        actual = [].concat(expected).sort(function (a, b) {
          var aId = a.getCall(0).callId;
          var bId = b.getCall(0).callId;

          // uuid, won't evet be equal
          return aId < bId ? -1 : 1;
        });

        failAssertion(this, "expected " + expected.join(", ") + " to be called in " + 
                      "order but were called as " + actual.join(", "));
      }
    },

    callCount: function assertCallCount(method, count) {
      verifyIsStub(method);

      if (method.callCount != count) {
        failAssertion(this, "expected " + method + " to be called " + times(count) +
                      " but was called " + times(method.callCount));
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

  mirrorAssertion("calledOnce", "expected %n to be called once but was called %c");
  mirrorAssertion("calledTwice", "expected %n to be called twice but was called %c");
  mirrorAssertion("calledThrice", "expected %n to be called thrice but was called %c");
  mirrorAssertion("calledOn", "expected %n to be called with %1 as this");
  mirrorAssertion("alwaysCalledOn", "expected %n to always be called with %1 as this");
  mirrorAssertion("calledWith", "expected %n to be called with arguments %*");
  mirrorAssertion("alwaysCalledWith", "expected %n to always be called with arguments %*");
  mirrorAssertion("calledWithExactly", "expected %n to be called with exact arguments %*");
  mirrorAssertion("alwaysCalledWithExactly", "expected %n to always be called with exact arguments %*");
  mirrorAssertion("threw", "%n did not throw exception");
  mirrorAssertion("alwaysThrew", "%n did not always throw exception");

  if (commonJSModule) {
    module.exports = assert;
  } else {
    sinon.assert = assert;
  }
}(typeof sinon == "object" && sinon || null));
