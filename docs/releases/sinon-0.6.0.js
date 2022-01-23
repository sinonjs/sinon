/**
 * Sinon 0.6.0, 2010/08/10
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

  sinon.mock = mock;
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

    spy: function spy() {
      return this.add(sinon.spy.apply(sinon, arguments));
    },

    stub: function stub() {
      return this.add(sinon.stub.apply(sinon, arguments));
    },

    mock: function mock() {
      return this.add(sinon.mock.apply(sinon, arguments));
    },

    inject: function inject(obj) {
      var col = this;

      obj.spy = function () {
        return col.spy.apply(col, arguments);
      };

      obj.stub = function () {
        return col.stub.apply(col, arguments);
      };

      obj.mock = function () {
        return col.mock.apply(col, arguments);
      };

      return obj;
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

sinon.timers = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  Date: Date
};

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

    global[method].clock = clock;
  }

  return function useFakeTimers(now) {
    var clock = sinon.clock.create(now);
    clock.restore = restore;
    clock.methods = Array.prototype.slice.call(arguments,
                                               typeof now == "number" ? 1 : 0);

    if (clock.methods.length === 0) {
      clock.methods = methods;
    }

    for (var i = 0, l = clock.methods.length; i < l; i++) {
      stubGlobal(clock.methods[i], clock);
    }

    return clock;
  };
}());

sinon.xhr = { XMLHttpRequest: this.XMLHttpRequest };

sinon.FakeXMLHttpRequest = (function () {
  var unsafeHeaders = {
    "Accept-Charset": true,
    "Accept-Encoding": true,
    "Connection": true,
    "Content-Length": true,
    "Cookie": true,
    "Cookie2": true,
    "Content-Transfer-Encoding": true,
    "Date": true,
    "Expect": true,
    "Host": true,
    "Keep-Alive": true,
    "Referer": true,
    "TE": true,
    "Trailer": true,
    "Transfer-Encoding": true,
    "Upgrade": true,
    "User-Agent": true,
    "Via": true
  };

  function FakeXMLHttpRequest() {
    this.readyState = FakeXMLHttpRequest.UNSENT;
    this.requestHeaders = {};
    this.requestBody = null;
    this.status = 0;
    this.statusText = "";

    if (typeof FakeXMLHttpRequest.onCreate == "function") {
      FakeXMLHttpRequest.onCreate(this);
    }
  }

  function verifyState(xhr) {
    if (xhr.readyState !== FakeXMLHttpRequest.OPENED) {
      throw new Error("INVALID_STATE_ERR");
    }

    if (xhr.sendFlag) {
      throw new Error("INVALID_STATE_ERR");
    }
  }

  sinon.extend(FakeXMLHttpRequest.prototype, {
    async: true,

    open: function open(method, url, async, username, password) {
      this.method = method;
      this.url = url;
      this.async = typeof async == "boolean" ? async : true;
      this.username = username;
      this.password = password;
      this.responseText = null;
      this.responseXML = null;
      this.requestHeaders = {};
      this.sendFlag = false;
      this.readyStateChange(FakeXMLHttpRequest.OPENED);
    },

    readyStateChange: function readyStateChange(state) {
      this.readyState = state;

      if (typeof this.onreadystatechange == "function") {
        this.onreadystatechange();
      }
    },

    setRequestHeader: function setRequestHeader(header, value) {
      verifyState(this);

      if (unsafeHeaders[header] || /^(Sec-|Proxy-)/.test(header)) {
        throw new Error("Refused to set unsafe header \"" + header + "\"");
      }

      if (this.requestHeaders[header]) {
        this.requestHeaders[header] += "," + value; 
      } else {
        this.requestHeaders[header] = value;
      }
    },

    // Helps testing
    setResponseHeaders: function setResponseHeaders(headers) {
      this.responseHeaders = {};

      for (var header in headers) {
        if (headers.hasOwnProperty(header)) {
          this.responseHeaders[header.toLowerCase()] = headers[header];
        }
      }

      if (this.async) {
        this.readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED);
      }
    },

    // Currently treats ALL data as a DOMString (i.e. no Document)
    send: function send(data) {
      verifyState(this);

      if (!/^(get|head)$/i.test(this.method)) {
        if (this.requestHeaders["Content-Type"]) {
          var value = this.requestHeaders["Content-Type"].split(";");
          this.requestHeaders["Content-Type"] = value[0] + ";charset=utf-8";
        } else {
          this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";
        }

        this.requestBody = data;
      }

      this.errorFlag = false;
      this.sendFlag = this.async;
      this.readyStateChange(FakeXMLHttpRequest.OPENED);

      if (typeof this.onSend == "function") {
        this.onSend(this);
      }
    },

    abort: function abort() {
      this.aborted = true;
      this.responseText = null;
      this.errorFlag = true;
      this.requestHeaders = {};

      if (this.readyState > sinon.FakeXMLHttpRequest.OPENED) {
        this.readyStateChange(sinon.FakeXMLHttpRequest.DONE);
        this.sendFlag = false;
      }

      this.readyState = sinon.FakeXMLHttpRequest.UNSENT;
    },

    getResponseHeader: function getResponseHeader(header) {
      if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
        return null;
      }

      if (/^Set-Cookie2?$/i.test(header)) {
        return null;
      }

      return this.responseHeaders[header.toLowerCase()];
    },

    getAllResponseHeaders: function getAllResponseHeaders() {
      if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
        return null;
      }

      var headers = {};

      for (var header in this.responseHeaders) {
        if (this.responseHeaders.hasOwnProperty(header) &&
            !/^Set-Cookie2?$/i.test(header)) {
          headers[header] = this.responseHeaders[header];
        }
      }

      return headers;
    },

    setResponseBody: function setResponseBody(body) {
      if (this.readyState == FakeXMLHttpRequest.DONE) {
        throw new Error("Request done");
      }

      if (this.async && this.readyState != FakeXMLHttpRequest.HEADERS_RECEIVED) {
        throw new Error("No headers received");
      }

      var chunkSize = this.chunkSize || 10;
      var index = 0;
      this.responseText = "";

      do {
        if (this.async) {
          this.readyStateChange(FakeXMLHttpRequest.LOADING);
        }

        this.responseText += body.substring(index, index + chunkSize);
        index += chunkSize;
      } while (index < body.length);

      var type = this.getResponseHeader("Content-Type");

      if (this.responseText &&
          (!type || /(text\/xml)|(application\/xml)|(\+xml)/.test(type))) {
        this.responseXML = FakeXMLHttpRequest.parseXML(this.responseText);
      }

      if (this.async) {
        this.readyStateChange(FakeXMLHttpRequest.DONE);
      } else {
        this.readyState = FakeXMLHttpRequest.DONE;
      }
    },

    respond: function respond(status, headers, body) {
      this.setResponseHeaders(headers || {});
      this.status = typeof status == "number" ? status : 200;
      this.statusText = FakeXMLHttpRequest.statusCodes[this.status];
      this.setResponseBody(body || "");
    }
  });

  sinon.extend(FakeXMLHttpRequest, {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4
  });

  // Borrowed from JSpec
  FakeXMLHttpRequest.parseXML = function parseXML(text) {
    var xmlDoc;

    if (typeof DOMParser != "undefined") {
      var parser = new DOMParser();
      xmlDoc = parser.parseFromString(text, "text/xml");
    } else {
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(text);
    }

    return xmlDoc;
  };

  FakeXMLHttpRequest.statusCodes = {
    100: "Continue",
    101: "Switching Protocols",
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    300: "Multiple Choice",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Request Entity Too Large",
    414: "Request-URI Too Long",
    415: "Unsupported Media Type",
    416: "Requested Range Not Satisfiable",
    417: "Expectation Failed",
    422: "Unprocessable Entity",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported"
  };

  return FakeXMLHttpRequest;
}());

(function (global) {
  var GlobalXMLHttpRequest = global.XMLHttpRequest;
  var GlobalActiveXObject = global.ActiveXObject;
  var supportsActiveX = typeof ActiveXObject != "undefined";
  var supportsXHR = typeof XMLHttpRequest != "undefined";

  sinon.useFakeXMLHttpRequest = function () {
    sinon.FakeXMLHttpRequest.restore = function restore(keepOnCreate) {
      if (supportsXHR) {
        global.XMLHttpRequest = GlobalXMLHttpRequest;
      }

      if (supportsActiveX) {
        global.ActiveXObject = GlobalActiveXObject;
      }

      delete sinon.FakeXMLHttpRequest.restore;

      if (keepOnCreate !== true) {
        delete sinon.FakeXMLHttpRequest.onCreate;
      }
    };

    if (supportsXHR) {
      global.XMLHttpRequest = sinon.FakeXMLHttpRequest;
    }

    if (supportsActiveX) {
      global.ActiveXObject = function ActiveXObject(objId) {
        if (objId == "Microsoft.XMLHTTP" || /^Msxml2\.XMLHTTP/.test(objId)) {
          return new sinon.FakeXMLHttpRequest();
        }

        return new GlobalActiveXObject(objId);
      };
    }

    return sinon.FakeXMLHttpRequest;
  };
}(this));

sinon.fakeServer = (function () {
  function F() {}

  function create(proto) {
    F.prototype = proto;
    return new F();
  }

  function responseArray(strOrArray) {
    if (Object.prototype.toString.call(strOrArray) == "[object Array]") {
      return strOrArray;
    }

    return [200, {}, strOrArray];
  }

  function match(response, requestMethod, requestUrl) {
    var matchMethod = !response.method || response.method.toLowerCase() == requestMethod.toLowerCase();
    var url = response.url;
    var matchUrl = !url || url == requestUrl || (typeof url.test == "function" && url.test(requestUrl));

    return matchMethod && matchUrl;
  }

  return {
    create: function () {
      var server = create(this);
      this.xhr = sinon.useFakeXMLHttpRequest();
      server.requests = [];

      this.xhr.onCreate = function (xhrObj) {
        server.addRequest(xhrObj);
      };

      return server;
    },

    addRequest: function addRequest(xhrObj) {
      var server = this;
      this.requests.push(xhrObj);

      xhrObj.onSend = function () {
        server.handleRequest(this);
      };
    },

    getHTTPMethod: function getHTTPMethod(request) {
      if (this.fakeHTTPMethods && /post/i.test(request.method)) {
        var match = request.requestBody.match(/_method=([^\b;]+)/);
        return !!match ? match[1] : request.method;
      }

      return request.method;
    },

    handleRequest: function handleRequest(xhr) {
      if (xhr.async) {
        if (!this.queue) {
          this.queue = [];
        }

        this.queue.push(xhr);
      } else {
        this.processRequest(xhr);
      }
    },

    respondWith: function respondWith(method, url, body) {
      if (arguments.length == 1) {
        this.response = responseArray(method);
      } else {
        if (!this.responses) {
          this.responses = [];
        }

        if (arguments.length == 2) {
          body = url;
          url = method;
          method = null;
        }

        this.responses.push({
          method: method,
          url: url,
          response: responseArray(body)
        });
      }
    },

    respond: function respond() {
      var queue = this.queue || [];

      for (var i = 0, l = queue.length; i < l; i++) {
        this.processRequest(queue[i]);
      }

      this.queue = [];
    },

    processRequest: function processRequest(request) {
      try {
        if (request.aborted) {
          return;
        }

        var response = this.response || [404, {}, ""];

        if (this.responses) {
          for (var i = 0, l = this.responses.length; i < l; i++) {
            if (match(this.responses[i], this.getHTTPMethod(request), request.url)) {
              response = this.responses[i].response;
              break;
            }
          }
        }

        request.respond(response[0], response[1], response[2]);
      } catch (e) {}
    },

    restore: function restore() {
      return this.xhr.restore && this.xhr.restore.apply(this.xhr, arguments);
    }
  };
}());

(function () {
  function Server() {}
  Server.prototype = sinon.fakeServer;

  sinon.fakeServerWithClock = new Server();

  sinon.fakeServerWithClock.addRequest = function addRequest(xhr) {
    if (xhr.async) {
      if (typeof setTimeout.clock == "object") {
        this.clock = setTimeout.clock;
      } else {
        this.clock = sinon.useFakeTimers();
        this.resetClock = true;
      }

      if (typeof this.longestTimeout != "number") {
        var clockSetTimeout = this.clock.setTimeout;
        var clockSetInterval = this.clock.setInterval;
        var server = this;

        this.clock.setTimeout = function (fn, timeout) {
          server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);

          return clockSetTimeout.apply(this, arguments);
        };

        this.clock.setInterval = function (fn, timeout) {
          server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);

          return clockSetInterval.apply(this, arguments);
        };
      }
    }

    return sinon.fakeServer.addRequest.call(this, xhr);
  };

  sinon.fakeServerWithClock.respond = function respond() {
    if (this.clock) {
      this.clock.tick(this.longestTimeout);
      this.longestTimeout = 0;

      if (this.resetClock) {
        this.clock.restore();
        this.resetClock = false;
      }
    }

    return sinon.fakeServer.respond.apply(this, arguments);
  };

  sinon.fakeServerWithClock.restore = function restore() {
    if (this.clock) {
      this.clock.restore();
    }

    return sinon.fakeServer.restore.apply(this, arguments);
  };
}());

(function () {
  sinon.sandbox = sinon.extend(sinon.create(sinon.collection), {
    useFakeTimers: function useFakeTimers() {
      this.clock = sinon.useFakeTimers.apply(sinon, arguments);

      return this.add(this.clock);
    },

    serverPrototype: sinon.fakeServer,

    useFakeServer: function useFakeServer() {
      this.server = (this.serverPrototype || sinon.fakeServer).create();

      return this.add(this.server);
    },

    inject: function (obj) {
      sinon.collection.inject.call(this, obj);

      if (this.clock) {
        obj.clock = this.clock;
      }

      if (this.server) {
        obj.server = this.server;
        obj.requests = this.server.requests;
      }

      return obj;
    }
  });

  sinon.sandbox.useFakeXMLHttpRequest = sinon.sandbox.useFakeServer;
}());

(function () {
  function createSandbox() {
    var sandbox = sinon.create(sinon.sandbox);
    var config = sinon.config || {};

    if (config.useFakeServer) {
      sandbox.useFakeServer();
    }

    if (config.useFakeTimers) {
      sandbox.useFakeTimers();
    }

    return sandbox;
  }

  function getConfig() {
    var config = {};
    var sConf = sinon.config || {};
    var tConf = sinon.test.config;

    for (var prop in sinon.test.config) {
      if (tConf.hasOwnProperty(prop)) {
        config[prop] = sConf.hasOwnProperty(prop) ? sConf[prop] : tConf[prop];
      }
    }

    return config;
  }

  function test(callback) {
    return function () {
      var sandbox = createSandbox();
      var exposed = sandbox.inject({});
      var exception, result, prop;
      var args = Array.prototype.slice.call(arguments);
      var config = getConfig();
      var object = config.injectIntoThis && this || config.injectInto;

      if (config.properties) {
        for (var i = 0, l = config.properties.length; i < l; i++) {
          prop = config.properties[i];

          if (exposed[prop]) {
            if (object) {
              object[prop] = exposed[prop];
            } else {
              args.push(exposed[config.properties[i]]);
            }
          }
        }
      } else {
        if (object) {
          object.sandbox = exposed;
        } else {
          args.push(exposed);
        }
      }

      try {
        result = callback.apply(this, args);
      } catch (e) {
        exception = e;
      }

      sandbox.verifyAndRestore();

      if (exception) {
        throw exception;
      }

      return result;
    };
  }

  test.config = {
    injectIntoThis: true,
    injectInto: null,
    properties: ["spy", "stub", "mock", "clock", "server", "requests"],
    useFakeTimers: false,
    useFakeServer: false
  };

  sinon.test = test;
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
