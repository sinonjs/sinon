/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 * @depend sandbox.js
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
      var sandbox = sinon.create(sinon.sandbox);
      var exposed = sandbox.inject({});
      var exception, result;
      var realArgs = Array.prototype.slice.call(arguments);

      try {
        result = callback.apply(this, realArgs.concat([exposed.stub, exposed.mock]));
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

  if (commonJSModule) {
    module.exports = test;
  } else {
    sinon.test = test;
  }
}(typeof sinon == "object" && sinon || null));
