/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 * @depend sandbox.js
 */
/*jslint indent: 2, eqeqeq: false, onevar: false, forin: true, plusplus: false*/
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

  if (commonJSModule) {
    module.exports = test;
  } else {
    sinon.test = test;
  }
}(typeof sinon == "object" && sinon || null));
