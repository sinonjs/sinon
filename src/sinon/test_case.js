/* @depend ../sinon.js */
/*jslint indent: 2, eqeqeq: false, onevar: false*/
/*global module, require, sinon*/
(function (sinon) {
  var commonJSModule = typeof module == "object" && typeof require == "function";

  if (!sinon && commonJSModule) {
    sinon = require("sinon");
  }

  if (!sinon) {
    return;
  }

  function testCase(tests, prefix) {
    var methods = {};
    var property, testName, nested, name, context;

    if (!tests) {
      throw new TypeError("test case object is null");
    }

    if (typeof prefix == "undefined") {
      prefix = "test ";
    }

    var setUp = tests.setUp;
    var tearDown = tests.tearDown;

    for (testName in tests) {
      property = tests[testName];

      if (/^(setUp|tearDown)$/.test(testName)) {
        continue;
      }

      if (typeof property == "function" && !/^test/.test(testName)) {
        testName = prefix + testName;
      }

      if (typeof property == "object") {
        nested = testCase(property, "");
        context = prefix + testName + " ";

        for (name in nested) {
          methods[context + name] = nested[name];
        }
      } else {
        if (setUp || tearDown) {
          methods[testName] = createTest(property, setUp, tearDown);
        } else {
          methods[testName] = property;
        }
      }
    }

    return methods;
  }

  function createTest(property, setUp, tearDown) {
    return function () {
      if (setUp) {
        setUp.apply(this, arguments);
      }

      var exception;

      try {
        property.apply(this, arguments);
      } catch(e) {
        exception = e;
      }

      if (tearDown) {
        tearDown.apply(this, arguments);
      }

      if (exception) {
        throw exception;
      }
    };
  }

  if (commonJSModule) {
    module.exports = testCase;
  } else {
    sinon.testCase = testCase;
  }
}(typeof sinon == "object" && sinon || null));
