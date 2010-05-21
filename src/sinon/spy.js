/* @depend ../sinon.js */
/*jslint indent: 2, eqeqeq: false, onevar: false, plusplus: false*/
/*global module, require, sinon*/
(function (sinon) {
  var commonJSModule = typeof module == "object" && typeof require == "function";
  var spyCall;
  var callId = 0;

  if (!sinon && commonJSModule) {
    sinon = require("sinon");
  }

  if (!sinon) {
    return;
  }

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

    function matchCalls(proxy, method, args, matchAny) {
      if (!proxy.called) {
        return false;
      }

      matchAny = arguments.length < 4 ? true : matchAny;
      var spyCall;
      var matches = 0;

      for (var i = 0, l = proxy.callCount; i < l; i += 1) {
        spyCall = proxy.getCall(i);

        if (spyCall[method].apply(spyCall, args)) {
          matches += 1;

          if (matchAny) {
            return true;
          }
        }
      }

      return matches === proxy.callCount;
    }

    // Public API
    return {
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
      },

      calledOn: function calledOn(thisObj) {
        return matchCalls(this, "calledOn", arguments);
      },

      calledWith: function calledWith() {
        return matchCalls(this, "calledWith", arguments);
      },

      calledWithExactly: function calledWithExactly() {
        return matchCalls(this, "calledWithExactly", arguments);
      },

      threw: function threw(error) {
        return matchCalls(this, "threw", arguments);
      },

      returned: function returned(returnValue) {
        return matchCalls(this, "returned", arguments);
      },

      alwaysCalledOn: function alwaysCalledOn(thisObj) {
        return matchCalls(this, "calledOn", arguments, false);
      },

      alwaysCalledWith: function alwaysCalledWith() {
        return matchCalls(this, "calledWith", arguments, false);
      },

      alwaysCalledWithExactly: function alwaysCalledWithExactly() {
        return matchCalls(this, "calledWithExactly", arguments, false);
      }

      /* TODO:
         alwaysCalledWithExactly: alwaysCalledWithExactly,
         alwaysThrew: alwaysThrew,
       */
    };
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

  if (commonJSModule) {
    module.exports = spy;
  } else {
    sinon.spy = spy;
    sinon.spyCall = spyCall;
  }
}(typeof sinon == "object" && sinon || null));
