/**
 * Sinon 0.5.0, 2010/06/09
 *
 * @author Christian Johansen (christian@cjohansen.no)
 *
 * (The BSD License)
 *
 * Copyright (c) 2010, Christian Johansen, christian@cjohansen.no
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright notice,
 *       this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 *     * Neither the name of Christian Johansen nor the names of his contributors
 *       may be used to endorse or promote products derived from this software
 *       without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
var sinon = (function () {
  return {
    wrapMethod: function wrapMethod(object, property, method) {
      if (!object) {
        throw new TypeError("Should wrap property of object");
      }

      if (typeof method != "function") {
        throw new TypeError("Method wrapper should be function");
      }

      var wrappedMethod = object[property];
      var type = typeof wrappedMethod;

      if (!!wrappedMethod && type != "function") {
        throw new TypeError("Attempted to wrap " + type + " as function");
      }

      object[property] = method;

      method.restore = function () {
        object[property] = wrappedMethod;
      };

      return method;
    },

    extend: function extend(target) {
      for (var i = 1, l = arguments.length; i < l; i += 1) {
        for (var prop in arguments[i]) {
          if (arguments[i].hasOwnProperty(prop)) {
            target[prop] = arguments[i][prop];
          }
        }
      }

      return target;
    },

    create: function create(proto) {
      if (Object.create) {
        return Object.create(proto);
      } else {
        var F = function () {};
        F.prototype = proto;
        return new F();
      }
    },

    deepEqual: function deepEqual(a, b) {
      if (typeof a != "object" || typeof b != "object") {
        return a === b;
      }

      if (a === b) {
        return true;
      }

      if (Object.prototype.toString.call(a) == "[object Array]") {
        if (a.length !== b.length) {
          return false;
        }

        for (var i = 0, l = a.length; i < l; i += 1) {
          if (!deepEqual(a[i], b[i])) {
            return false;
          }
        }

        return true;
      }

      var prop, aLength = 0, bLength = 0;

      for (prop in a) {
        aLength += 1;

        if (!deepEqual(a[prop], b[prop])) {
          return false;
        }
      }

      for (prop in b) {
        bLength += 1;
      }

      if (aLength != bLength) {
        return false;
      }

      return true;
    },

    keys: function keys(object) {
      var objectKeys = [];

      for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
          objectKeys.push(prop);
        }
      }

      return objectKeys.sort();
    }
  };
}());

if (typeof module == "object" && typeof require == "function") {
  module.exports = sinon;
}

(function () {
  var spyCall;
  var callId = 0;

  function spy(object, property) {
    if (!property && typeof object == "function") {
      return spy.create(object);
    }

    if (!object || !property) {
      return spy.create(function () {});
    }

    var method = object[property];
    return sinon.wrapMethod(object, property, spy.create(method));
  }

  sinon.extend(spy, (function () {
    var slice = Array.prototype.slice;

    function delegateToCalls(api, method, matchAny, actual) {
      api[method] = function () {
        if (!this.called) {
          return false;
        }

        var spyCall;
        var matches = 0;

        for (var i = 0, l = this.callCount; i < l; i += 1) {
          spyCall = this.getCall(i);

          if (spyCall[actual || method].apply(spyCall, arguments)) {
            matches += 1;

            if (matchAny) {
              return true;
            }
          }
        }

        return matches === this.callCount;
      };
    }

    // Public API
    var spyApi = {
      called: false,
      calledOnce: false,
      calledTwice: false,
      calledThrice: false,
      callCount: 0,

      create: function create(func) {
        if (typeof func != "function") {
          func = function () {};
        }

        function proxy() {
          return proxy.invoke(func, this, slice.call(arguments));
        }

        sinon.extend(proxy, spy);
        delete proxy.create;
        sinon.extend(proxy, func);

        proxy.args = [];
        proxy.returnValues = [];
        proxy.thisValues = [];
        proxy.exceptions = [];
        proxy.callIds = [];
        proxy.prototype = func.prototype;

        return proxy;
      },

      invoke: function invoke(func, thisObj, args) {
        var exception, returnValue;
        this.called = true;
        this.callCount += 1;
        this.calledOnce = this.callCount == 1;
        this.calledTwice = this.callCount == 2;
        this.calledThrice = this.callCount == 3;
        this.thisValues.push(thisObj);
        this.args.push(args);
        this.callIds.push(callId++);

        try {
          returnValue = func.apply(thisObj, args);
        } catch (e) {
          this.returnValues.push(undefined);
          exception = e;
          throw e;
        } finally {
          this.exceptions.push(exception);
        }

        this.returnValues.push(returnValue);

        return returnValue;
      },

      getCall: function getCall(i) {
        if (i < 0 || i >= this.callCount) {
          return null;
        }

        return spyCall.create(this.thisValues[i], this.args[i],
                              this.returnValues[i], this.exceptions[i],
                              this.callIds[i]);
      },

      calledBefore: function calledBefore(spy) {
        if (!this.called) {
          return false;
        }

        if (!spy.called) {
          return true;
        }

        return this.callIds[0] < spy.callIds[0];
      },

      calledAfter: function calledAfter(spy) {
        if (!this.called || !spy.called) {
          return false;
        }

        return this.callIds[this.callCount - 1] > spy.callIds[spy.callCount - 1];
      }
    };

    delegateToCalls(spyApi, "calledOn", true);
    delegateToCalls(spyApi, "alwaysCalledOn", false, "calledOn");
    delegateToCalls(spyApi, "calledWith", true);
    delegateToCalls(spyApi, "alwaysCalledWith", false, "calledWith");
    delegateToCalls(spyApi, "calledWithExactly", true);
    delegateToCalls(spyApi, "alwaysCalledWithExactly", false, "calledWithExactly");
    delegateToCalls(spyApi, "threw", true);
    delegateToCalls(spyApi, "alwaysThrew", false, "threw");
    delegateToCalls(spyApi, "returned", true);
    delegateToCalls(spyApi, "alwaysReturned", false, "returned");

    return spyApi;
  }()));

  spyCall = (function () {
    return {
      create: function create(thisObj, args, returnValue, exception, id) {
        var proxyCall = sinon.create(spyCall);
        delete proxyCall.create;
        proxyCall.thisObj = thisObj;
        proxyCall.args = args;
        proxyCall.returnValue = returnValue;
        proxyCall.exception = exception;
        proxyCall.callId = typeof id == "number" && id || callId++;

        return proxyCall;
      },

      calledOn: function calledOn(thisObj) {
        return this.thisObj === thisObj;
      },

      calledWith: function calledWith() {
        for (var i = 0, l = arguments.length; i < l; i += 1) {
          if (!sinon.deepEqual(arguments[i], this.args[i])) {
            return false;
          }
        }

        return true;
      },

      calledWithExactly: function calledWithExactly() {
        return arguments.length == this.args.length &&
          this.calledWith.apply(this, arguments);
      },

      returned: function returned(value) {
        return this.returnValue === value;
      },

      threw: function threw(error) {
        if (typeof error == "undefined" || !this.exception) {
          return !!this.exception;
        }

        if (typeof error == "string") {
          return this.exception.name == error;
        }

        return this.exception === error;
      }
    };
  }());

  sinon.spy = spy;
  sinon.spyCall = spyCall;
}());

(function () {
  function stub(object, property, func) {
    if (!!func && typeof func != "function") {
      throw new TypeError("Custom stub should be function");
    }

    var wrapper;

    if (func) {
      wrapper = sinon.spy && sinon.spy.create ? sinon.spy.create(func) : func;
    } else {
      wrapper = stub.create();
    }

    if (!object && !property) {
      return sinon.stub.create();
    }

    if (!property && !!object) {
      for (var prop in object) {
        if (object.hasOwnProperty(prop) && typeof object[prop] == "function") {
          stub(object, prop);
        }
      }

      return object;
    }

    return sinon.wrapMethod(object, property, wrapper);
  }

  sinon.extend(stub, (function () {
    var slice = Array.prototype.slice;

    return {
      create: function create() {
        function functionStub() {
          if (functionStub.exception) {
            throw functionStub.exception;
          }

          if (typeof functionStub.callArgAt == "number") {
            var func = arguments[functionStub.callArgAt];

            if (typeof func != "function") {
              throw new TypeError("argument at index " + functionStub.callArgAt +
                                  " is not a function: " + func);
            }

            func.apply(null, functionStub.callbackArguments);
          }

          return functionStub.returnValue;
        }

        if (sinon.spy) {
          functionStub = sinon.spy.create(functionStub);
        }

        sinon.extend(functionStub, stub);

        return functionStub;
      },

      returns: function returns(value) {
        this.returnValue = value;

        return this;
      },

      throws: function throws(error, message) {
        if (typeof error == "string") {
          this.exception = new Error(message);
          this.exception.name = error;
        } else if (!error) {
          this.exception = new Error("Error");
        } else {
          this.exception = error;
        }

        return this;
      },

      callsArg: function callsArg(pos) {
        if (typeof pos != "number") {
          throw new TypeError("argument index is not number");
        }

        this.callArgAt = pos;
        this.callbackArguments = [];
      },

      callsArgWith: function callsArgWith(pos) {
        if (typeof pos != "number") {
          throw new TypeError("argument index is not number");
        }

        this.callArgAt = pos;
        this.callbackArguments = slice.call(arguments, 1);
      }
    };
  }()));

  sinon.stub = stub;
}());

(function () {
  function mock(object) {
    if (!object) {
      return sinon.expectation.create("Anonymous mock");
    }

    return mock.create(object);
  }

  sinon.mock = mock;

  sinon.extend(mock, function () {
    function each(collection, callback) {
      if (!collection) {
        return;
      }

      for (var i = 0, l = collection.length; i < l; i += 1) {
        callback(collection[i]);
      }
    }

    return {
      create: function create(object) {
        if (!object) {
          throw new TypeError("object is null");
        }

        var mockObject = sinon.extend({}, mock);
        mockObject.object = object;
        delete mockObject.create;

        return mockObject;
      },

      expects: function expects(method) {
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
      },

      restore: function restore() {
        var object = this.object;

        each(this.proxies, function (proxy) {
          if (typeof object[proxy].restore == "function") {
            object[proxy].restore();
          }
        });
      },

      verify: function verify() {
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
      },

      invokeMethod: function invokeMethod(method, thisObj, args) {
        var expectations = this.expectations && this.expectations[method];
        var length = expectations && expectations.length || 0;

        for (var i = 0; i < length; i += 1) {
          if (!expectations[i].met()) {
            return expectations[i].apply(thisObj, args);
          }
        }

        return expectations[length - 1].apply(thisObj, args);
      }
    };
  }());

  function err(message) {
    var exception = new Error(message);
    exception.name = "ExpectationError";

    throw exception;
  }

  sinon.expectation = (function () {
    var slice = Array.prototype.slice;
    var _invoke = sinon.spy.invoke;

    function timesInWords(times) {
      if (times == 1) {
        return "once";
      } else if (times == 2) {
        return "twice";
      } else if (times == 3) {
        return "thrice";
      }

      return times + " times";
    }

    function receivedMinCalls(expectation) {
      var hasMinLimit = typeof expectation.minCalls == "number";
      return !hasMinLimit || expectation.callCount >= expectation.minCalls;
    }

    function receivedMaxCalls(expectation) {
      if (typeof expectation.maxCalls != "number") {
        return false;
      }

      return expectation.callCount == expectation.maxCalls;
    }

    return {
      minCalls: 1,
      maxCalls: 1,

      create: function create(methodName) {
        var expectation = sinon.extend(sinon.stub.create(), sinon.expectation);
        delete expectation.create;
        expectation.method = methodName;

        return expectation;
      },

      invoke: function invoke(func, thisObj, args) {
        this.verifyCallAllowed(thisObj, args);

        return _invoke.apply(this, arguments);
      },

      atLeast: function atLeast(num) {
        if (typeof num != "number") {
          throw new TypeError("'" + num + "' is not number");
        }

        if (!this.limitsSet) {
          this.maxCalls = null;
          this.limitsSet = true;
        }

        this.minCalls = num;

        return this;
      },

      atMost: function atMost(num) {
        if (typeof num != "number") {
          throw new TypeError("'" + num + "' is not number");
        }

        if (!this.limitsSet) {
          this.minCalls = null;
          this.limitsSet = true;
        }

        this.maxCalls = num;

        return this;
      },

      never: function never() {
        return this.exactly(0);
      },

      once: function once() {
        return this.exactly(1);
      },

      twice: function twice() {
        return this.exactly(2);
      },

      thrice: function thrice() {
        return this.exactly(3);
      },

      exactly: function exactly(num) {
        if (typeof num != "number") {
          throw new TypeError("'" + num + "' is not a number");
        }

        this.atLeast(num);
        return this.atMost(num);
      },

      met: function met() {
        return !this.failed && receivedMinCalls(this);
      },

      verifyCallAllowed: function verifyCallAllowed(thisObj, args) {
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

        if (!args || args.length === 0) {
          err(this.method + " received no arguments, expected " +
              this.expectedArguments.join());
        }

        if (args.length < this.expectedArguments.length) {
          err(this.method + " received too few arguments (" + args.join() +
              "), expected " + this.expectedArguments.join());
        }

        if (this.expectsExactArgCount &&
            args.length != this.expectedArguments.length) {
          err(this.method + " received too many arguments (" + args.join() +
              "), expected " + this.expectedArguments.join());
        }

        for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {
          if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
            err(this.method + " received wrong arguments (" + args.join() +
                "), expected " + this.expectedArguments.join());
          }
        }
      },

      withArgs: function withArgs() {
        this.expectedArguments = slice.call(arguments);
        return this;
      },

      withExactArgs: function withExactArgs() {
        this.withArgs.apply(this, arguments);
        this.expectsExactArgCount = true;
        return this;
      },

      on: function on(thisObj) {
        this.expectedThis = thisObj;
        return this;
      },

      verify: function verify() {
        if (!this.met()) {
          err(this.method + " expected to be called " + timesInWords(this.minCalls) +
              ", but was called " + timesInWords(this.callCount));
        }

        return true;
      }
    };
  }());
}());

(function () {
  function getFakes(collection) {
    if (!collection.fakes) {
      collection.fakes = [];
    }

    return collection.fakes;
  }

  function each(collection, method) {
    var fakes = getFakes(collection);

    for (var i = 0, l = fakes.length; i < l; i += 1) {
      if (typeof fakes[i][method] == "function") {
        fakes[i][method]();
      }
    }
  }

  var collection = {
    verify: function resolve() {
      each(this, "verify");
    },

    restore: function restore() {
      each(this, "restore");
    },

    verifyAndRestore: function verifyAndRestore() {
      var exception;

      try {
        this.verify();
      } catch (e) {
        exception = e;
      }

      this.restore();

      if (exception) {
        throw exception;
      }
    },

    add: function add(fake) {
      getFakes(this).push(fake);

      return fake;
    },

    stub: function stub() {
      return this.add(sinon.stub.apply(sinon, arguments));
    },

    mock: function mock() {
      return this.add(sinon.mock.apply(sinon, arguments));
    }
  };

  sinon.collection = collection;
}());

sinon.clock = (function () {
  var id = 0;

  function addTimer(args, recurring) {
    if (args.length === 0) {
      throw new Error("Function requires at least 1 parameter");
    }

    var toId = id++;
    var delay = args[1] || 0;

    if (!this.timeouts) {
      this.timeouts = {};
    }

    this.timeouts[toId] = {
      func: args[0],
      callAt: this.now + delay
    };

    if (recurring === true) {
      this.timeouts[toId].interval = delay;
    }

    return toId;
  }

  function createObject(object) {
    var newObject;

    if (Object.create) {
      newObject = Object.create(object);
    } else {
      var F = function () {};
      F.prototype = object;
      newObject = new F();
    }

    newObject.Date.clock = newObject;
    return newObject;
  }

  return {
    now: 0,

    create: function create(now) {
      var clock = createObject(this);

      if (typeof now == "number") {
        this.now = now;
      }

      return clock;
    },

    setTimeout: function setTimeout(callback, timeout) {
      return addTimer.call(this, arguments, false);
    },

    clearTimeout: function clearTimeout(id) {
      if (!this.timeouts) {
        this.timeouts = [];
      }

      delete this.timeouts[id];
    },

    setInterval: function setInterval(callback, timeout) {
      return addTimer.call(this, arguments, true);
    },

    clearInterval: function clearInterval(id) {
      this.clearTimeout(id);
    },

    tick: function tick(ms) {
      var found, timer, prop;

      while (this.timeouts && found !== 0) {
        found = 0;

        for (prop in this.timeouts) {
          if (this.timeouts.hasOwnProperty(prop)) {
            timer = this.timeouts[prop];

            if (timer.callAt >= this.now && timer.callAt <= this.now + ms) {
              try {
                if (typeof timer.func == "function") {
                  timer.func.call(null);
                } else {
                  eval(timer.func);
                }
              } catch (e) {}

              if (typeof timer.interval == "number") {
                found += 1;
                timer.callAt += timer.interval;
              } else {
                delete this.timeouts[prop];
              }
            }
          }
        }
      }

      this.now += ms;
    },

    reset: function reset() {
      this.timeouts = {};
    },

    Date: (function () {
      var NativeDate = Date;

      function ClockDate(year, month, date, hour, minute, second, ms) {
        // Defensive and verbose to avoid potential harm in passing
        // explicit undefined when user does not pass argument
        switch (arguments.length) {
        case 0:
          return new NativeDate(ClockDate.clock.now);
        case 1:
          return new NativeDate(year);
        case 2:
          return new NativeDate(year, month);
        case 3:
          return new NativeDate(year, month, date);
        case 4:
          return new NativeDate(year, month, date, hour);
        case 5:
          return new NativeDate(year, month, date, hour, minute);
        case 6:
          return new NativeDate(year, month, date, hour, minute, second);
        default:
          return new NativeDate(year, month, date, hour, minute, second, ms);
        }
      }

      if (NativeDate.now) {
        ClockDate.now = function now() {
          return ClockDate.clock.now;
        };
      }

      if (NativeDate.toSource) {
        ClockDate.toSource = function toSource() {
          return NativeDate.toSource();
        };
      }

      ClockDate.toString = function toString() {
        return NativeDate.toString();
      };

      ClockDate.prototype = NativeDate.prototype;
      ClockDate.parse = NativeDate.parse;
      ClockDate.UTC = NativeDate.UTC;

      return ClockDate;
    }())
  };
}());

sinon.useFakeTimers = (function () {
  var global = this;
  var methods = ["setTimeout", "setInterval", "clearTimeout", "clearInterval"];

  function restore() {
    var method;

    for (var i = 0, l = this.methods.length; i < l; i++) {
      method = this.methods[i];
      global[method] = this["_" + method];
    }
  }

  function stubGlobal(method, clock) {
    clock["_" + method] = global[method];

    global[method] = function () {
      return clock[method].apply(clock, arguments);
    };
  }

  return function useFakeTimers(now) {
    var clock = sinon.clock.create(now);
    clock.restore = restore;
    clock.methods = Array.prototype.slice.call(arguments, typeof now == "number" ? 1 : 0);

    if (clock.methods.length === 0) {
      clock.methods = methods;
    }

    for (var i = 0, l = clock.methods.length; i < l; i++) {
      stubGlobal(clock.methods[i], clock);
    }

    return clock;
  };
}());

(function () {
  var slice = Array.prototype.slice;
  var assert;

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

  sinon.assert = assert;
}());

(function () {
  function createTest(property, setUp, tearDown) {
    return function () {
      if (setUp) {
        setUp.apply(this, arguments);
      }

      var exception;

      try {
        property.apply(this, arguments);
      } catch (e) {
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
    var method;

    for (testName in tests) {
      if (tests.hasOwnProperty(testName)) {
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
            if (nested.hasOwnProperty(name)) {
              methods[context + name] = nested[name];
            }
          }
        } else {
          method = property;

          if (setUp || tearDown) {
            method = createTest(property, setUp, tearDown);
          }

          methods[testName] = sinon.test(method);
        }
      }
    }

    return methods;
  }

  sinon.testCase = testCase;
}());

sinon.sandbox = sinon.extend(sinon.create(sinon.collection), {
  useFakeTimers: function useFakeTimers() {
    this.clock = sinon.useFakeTimers.apply(sinon, arguments);

    return this.add(this.clock);
  }
});

(function () {
  sinon.test = function test(callback) {
    return function () {
      var collection = sinon.create(sinon.collection);
      var exception, result;
      var realArgs = Array.prototype.slice.call(arguments);

      try {
        result = callback.apply(this, realArgs.concat([function () {
          return collection.stub.apply(collection, arguments);
        }, function () {
          return collection.mock.apply(collection, arguments);
        }]));
      } catch (e) {
        exception = e;
      }

      collection.verifyAndRestore();

      if (exception) {
        throw exception;
      }

      return result;
    };
  };
}());
