/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 * @depend collection.js
 */
/*jslint indent: 2, eqeqeq: false, onevar: false, forin: true*/
/*global module, require, sinon*/
/**
 * Test function, sandboxes fakes
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
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
  }

  if (commonJSModule) {
    module.exports = test;
  } else {
    sinon.test = test;
  }
}(typeof sinon == "object" && sinon || null));
