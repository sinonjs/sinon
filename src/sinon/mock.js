(function (sinon) {
  var commonJSModule = typeof module == "object" && typeof require == "function";

  if (!sinon && commonJSModule) {
    sinon = require("sinon");
  }

  if (!sinon) {
    return;
  }

  function mock (object) {
    if (!object) {
      return sinon.expectation.create("Anonymous mock");
    }

    return mock.create(object);
  }

  sinon.mock = mock;

  sinon.extend(mock, function () {
    function create (object) {
      if (!object) {
        throw new TypeError("object is null");
      }

      var mockObject = sinon.extend({}, mock);
      mockObject.object = object;
      delete mockObject.create;

      return mockObject;
    }

    function expects (method) {
      if (!method) {
        throw new TypeError("method is falsy");
      }

      if (!this.expectations) {
        this.expectations = {};
        this.proxies = [];
      }

      if (!this.expectations[method]) {
        this.expectations[method] = [];
        var mock = this;

        sinon.wrapMethod(this.object, method, function () {
          return mock.invokeMethod(method, this, arguments);
        });

        this.proxies.push(method);
      }

      var expectation = sinon.expectation.create(method);
      this.expectations[method].push(expectation);

      return expectation;
    }

    function each (collection, callback) {
      if (!collection) {
        return;
      }

      for (var i = 0, l = collection.length; i < l; i++) {
        callback(collection[i]);
      }
    }

    function restore () {
      var object = this.object;

      each(this.proxies, function (proxy) {
        if (typeof object[proxy].restore == "function") {
          object[proxy].restore();
        }
      });
    }

    function verify () {
      var expectations = this.expectations || {};
      var exception;

      try {
        each(this.proxies, function (proxy) {
          each(expectations[proxy], function (expectation) {
            expectation.verify();
          });
        });
      } catch (e) {
        exception = e;
      }

      this.restore();

      if (exception) {
        throw exception;
      }

      return true;
    }

    function invokeMethod (method, thisObj, args) {
      var expectations = this.expectations && this.expectations[method];
      var length = expectations && expectations.length || 0;

      for (var i = 0; i < length; i++) {
        if (!expectations[i].met()) {
          return expectations[i].apply(thisObj, args);
        }
      }

      return expectations[length - 1].apply(thisObj, args);
    }

    return {
      create: create,
      expects: expects,
      restore: restore,
      verify: verify,
      invokeMethod: invokeMethod
    }
  }());

  function err (message) {
    var exception = new Error(message);
    exception.name = "ExpectationError";

    throw exception;
  }

  sinon.expectation = (function () {
    function create (methodName) {
      var expectation = sinon.extend(sinon.stub.create(), sinon.expectation);
      delete expectation.create;
      expectation.method = methodName;

      return expectation;
    }

    var _invoke = sinon.spy.invoke;

    function invoke (func, thisObj, args) {
      this.verifyCallAllowed(thisObj, args);

      return _invoke.apply(this, arguments);
    }

    function atLeast (num) {
      if (typeof num != "number") {
        throw new TypeError("'" + num + "' is not number");
      }

      if (!this.limitsSet) {
        this.maxCalls = null;
        this.limitsSet = true;
      }

      this.minCalls = num;
    }

    function atMost (num) {
      if (typeof num != "number") {
        throw new TypeError("'" + num + "' is not number");
      }

      if (!this.limitsSet) {
        this.minCalls = null;
        this.limitsSet = true;
      }

      this.maxCalls = num;
    }

    function never () {
      this.exactly(0);
    }

    function once () {
      this.exactly(1);
    }

    function twice () {
      this.exactly(2);
    }

    function thrice () {
      this.exactly(3);
    }

    function exactly (num) {
      if (typeof num != "number") {
        throw new TypeError("'" + num + "' is not a number");
      }

      this.atLeast(num);
      this.atMost(num);
    }

    function timesInWords (times) {
      if (times == 1) {
        return "once";
      } else if (times == 2) {
        return "twice";
      } else if (times == 3) {
        return "thrice";
      }

      return times + " times";
    }

    function verifyCallAllowed (thisObj, args) {
      if (receivedMaxCalls(this)) {
        this.failed = true;
        err(this.method + " already called " + timesInWords(this.maxCalls));
      }

      if ("expectedThis" in this && this.expectedThis !== thisObj) {
        err(this.method + " called with " + thisObj + " as thisObj, expected " +
            this.expectedThis);
      }

      if (!("expectedArguments" in this)) {
        return true;
      }

      if (!args || args.length == 0) {
        err(this.method + " received no arguments, expected " +
            this.expectedArguments.join());
      }

      if (args.length < this.expectedArguments.length) {
        err(this.method + " received too few arguments (" + args.join() +
            "), expected " + this.expectedArguments.join());
      }

      if (this.expectsExactArgCount && args.length != this.expectedArguments.length) {
        err(this.method + " received too many arguments (" + args.join() +
            "), expected " + this.expectedArguments.join());
      }

      for (var i = 0, l = this.expectedArguments.length; i < l; i++) {
        if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
          err(this.method + " received wrong arguments (" + args.join() +
              "), expected " + this.expectedArguments.join());
        }
      }
    }

    function met () {
      return !this.failed && receivedMinCalls(this);
    }

    function receivedMinCalls (expectation) {
      var hasMinLimit = typeof expectation.minCalls == "number";
      return !hasMinLimit || expectation.callCount() >= expectation.minCalls;
    }

    function receivedMaxCalls (expectation) {
      if (typeof expectation.maxCalls != "number") {
        return false;
      }

      return expectation.callCount() == expectation.maxCalls;
    }

    var slice = Array.prototype.slice;

    function withArgs () {
      this.expectedArguments = slice.call(arguments);
    }

    function withExactArgs () {
      withArgs.apply(this, arguments);
      this.expectsExactArgCount = true;
    }

    function on (thisObj) {
      this.expectedThis = thisObj;
    }

    function verify () {
      if (!this.met()) {
        err(this.method + " expected to be called " + timesInWords(this.minCalls) +
            ", but was called " + timesInWords(this.callCount));
      }

      return true;
    }

    return {
      minCalls: 1,
      maxCalls: 1,
      create: create,
      invoke: invoke,
      atLeast: atLeast,
      atMost: atMost,
      never: never,
      once: once,
      twice: twice,
      thrice: thrice,
      exactly: exactly,
      met: met,
      verifyCallAllowed: verifyCallAllowed,
      withArgs: withArgs,
      withExactArgs: withExactArgs,
      on: on,
      verify: verify
    };
  }());

  if (commonJSModule) {
    module.exports = mock;
  } else {
    sinon.mock = mock;
  }
}(typeof sinon == "object" && sinon || null));
