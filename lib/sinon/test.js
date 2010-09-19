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

  function createSandbox(config) {
    var sandbox = sinon.create(sinon.sandbox);

    if (config.useFakeServer) {
      if (typeof config.useFakeServer == "object") {
        sandbox.serverPrototype = config.useFakeServer;
      }

      sandbox.useFakeServer();
    }

    if (config.useFakeTimers) {
      if (typeof config.useFakeTimers == "object") {
        sandbox.useFakeTimers.apply(sandbox, config.useFakeTimers);
      } else {
        sandbox.useFakeTimers();
      }
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
    var type = typeof callback;

    if (type != "function") {
      throw new TypeError("sinon.test needs to wrap a test function, got " + type);
    }

    return function () {
      var config = getConfig();
      var sandbox = createSandbox(config);
      var exposed = sandbox.inject({});
      var exception, result, prop;
      var args = Array.prototype.slice.call(arguments);
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
    useFakeTimers: true,
    useFakeServer: true
  };

  if (commonJSModule) {
    module.exports = test;
  } else {
    sinon.test = test;
  }
}(typeof sinon == "object" && sinon || null));
