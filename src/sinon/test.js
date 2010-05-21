/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 * @depend collection.js
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
      var collection = sinon.collection.create();
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
  }

  if (commonJSModule) {
    module.exports = test;
  } else {
    sinon.test = test;
  }
}(typeof sinon == "object" && sinon || null));
