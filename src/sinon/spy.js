(function (sinon) {
  var commonJSModule = typeof module == "object" && typeof require == "function";

  if (!sinon && commonJSModule) {
    sinon = require("sinon");
  }

  if (!sinon) {
    return;
  }

  function spy (object, property, func) {
    var method = object[property];
    return sinon.wrapMethod(object, property, spy.create(method));
  }

  sinon.extend(spy, (function () {
    var slice = Array.prototype.slice;

    function create (func) {
      if (typeof func != "function") {
        throw new TypeError("spy needs a function to spy on");
      }

      function proxy () {
        return proxy.invoke(func, this, slice.call(arguments));
      }

      sinon.extend(proxy, spy);
      delete proxy.create;
      sinon.extend(proxy, func);

      return proxy;
    }

    function invoke (func, thisObj, args) {
      if (!this.calls) {
        this.calls = [];
      }

      var call = spyCall.create(thisObj, args);

      try {
        call.returnValue = func.apply(thisObj, args);
      } catch (e) {
        call.exception = e;
        throw e;
      } finally {
        this.calls.push(call);
      }

      return call.returnValue;
    }

    function getCall (i) {
      return this.calls && this.calls[i];
    }

    function called () {
      return this.callCount() > 0;
    }

    function callCount () {
      return this.calls && this.calls.length || 0;
    }

    function calledOn (thisObj) {
      return matchAnyCall(this, "calledOn", arguments);
    }

    function calledWith () {
      return matchAnyCall(this, "calledWith", arguments);
    }

    function calledWithExactly () {
      return matchAnyCall(this, "calledWithExactly", arguments);
    }

    function threw (error) {
      return matchAnyCall(this, "threw", arguments);
    }

    function matchAnyCall (proxy, method, args) {
      if (!proxy.calls) {
        return false;
      }

      var spyCall;

      for (var i = 0, l = proxy.calls.length; i < l; i++) {
        spyCall = proxy.calls[i];

        if (spyCall[method].apply(spyCall, args)) {
          return true;
        }
      }

      return false;
    }

    return {
      create: create,
      called: called,
      calledOn: calledOn,
      calledWith: calledWith,
      calledWithExactly: calledWithExactly,
      threw: threw,
      /* TODO:
         returned: returned,
         alwaysCalledOn: alwaysCalledOn,
         alwaysCalledWith: alwaysCalledWith,
         alwaysCalledWithExactly: alwaysCalledWithExactly,
         alwaysThrew: alwaysThrew,
       */
      callCount: callCount,
      getCall: getCall,
      invoke: invoke
    };
  }()));

  var spyCall = (function () {
    function calledOn (thisObj) {
      return this.thisObj === thisObj;
    }

    function calledWith () {
      for (var i = 0, l = arguments.length; i < l; i++) {
        if (!sinon.deepEqual(arguments[i], this.args[i])) {
          return false;
        }
      }

      return true;
    }

    function calledWithExactly () {
      return arguments.length == this.args.length &&
               this.calledWith.apply(this, arguments);
    }

    function returned (value) {
      return this.returnValue === value;
    }

    function threw (error) {
      if (typeof error == "undefined" || !this.exception) {
        return !!this.exception;
      }

      if (typeof error == "string") {
        return this.exception.name == error;
      }

      return this.exception === error;
    }

    function create (thisObj, args, returnValue) {
      var proxyCall = sinon.create(spyCall);
      delete proxyCall.create;
      proxyCall.thisObj = thisObj;
      proxyCall.args = args;
      proxyCall.returnValue = returnValue;

      return proxyCall;
    }

    return {
      create: create,
      calledOn: calledOn,
      calledWith: calledWith,
      calledWithExactly: calledWithExactly,
      returned: returned,
      threw: threw
    };
  }());

  if (commonJSModule) {
    module.exports = spy;
  } else {
    sinon.spy = spy;
    sinon.spyCall = spyCall;
  }
}(typeof sinon == "object" && sinon || null));
