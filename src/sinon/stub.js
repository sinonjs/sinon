/**
 * @depend ../sinon.js
 * @depend spy.js
 */
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

    if (!object || !property) {
      return sinon.stub.create();
    }

    return sinon.wrapMethod(object, property, wrapper);
  }

  sinon.extend(stub, (function () {
    return {
      create: function create() {
        function functionStub() {
          if (functionStub.exception) {
            throw functionStub.exception;
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

      throwsException: function throwsException(error, message) {
        if (typeof error == "string") {
          this.exception = new Error(message);
          this.exception.name = error;
        } else if (!error) {
          this.exception = new Error("Error");
        } else {
          this.exception = error;
        }

        return this;
      }
    };
  }()));

  if (commonJSModule) {
    module.exports = stub;
  } else {
    sinon.stub = stub;
  }
}(typeof sinon == "object" && sinon || null));
