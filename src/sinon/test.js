/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 */
/*jslint indent: 2, eqeqeq: false, onevar: false, forin: true*/
/*global module, require, sinon*/
(function (sinon) {
  var commonJSModule = typeof module == "object" && typeof require == "function";

  if (!sinon && commonJSModule) {
    sinon = require("sinon");
  }

  if (!sinon) {
    return;
  }

  function test(callback) {
    return function () {
      var fakes = [];
      var exception, result;
      var realArgs = Array.prototype.slice.call(arguments);
      var args = [function () {
        fakes.push(sinon.stub.apply(sinon, arguments));
        return fakes[fakes.length - 1];
      }, function () {
        fakes.push(sinon.mock.apply(sinon, arguments));
        return fakes[fakes.length - 1];
      }];

      try {
        result = callback.apply(this, realArgs.concat(args));
      } catch (e) {
        exception = e;
      }

      for (var i = 0, l = fakes.length; i < l; i += 1) {
        if (!exception) {
          if (typeof fakes[i].verify == "function") {
            try {
              fakes[i].verify();
            } catch (ex) {
              exception = ex;
            }
          }
        }

        if (typeof fakes[i].restore == "function") {
          fakes[i].restore();
        }
      }

      if (exception) {
        throw exception;
      }

      return result;
    };
  }

  if (commonJSModule) {
    module.exports = test;
  } else {
    sinon.test = test;
  }
}(typeof sinon == "object" && sinon || null));
