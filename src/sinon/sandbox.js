/**
 * @depend ../sinon.js
 * @depend collection.js
 * @depend util/timers.js
 */
/*jslint indent: 2, eqeqeq: false, onevar: false*/
/*global module, require, sinon*/
/**
 * Sandboxes are like collections, except they also handle 
 * Manages fake collections as well as fake utilities such as Sinon's
 * timers and fake XHR implementation in one convenient object.
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

  var sandbox = sinon.extend(sinon.create(sinon.collection), {
    useFakeTimers: function useFakeTimers() {
      this.clock = sinon.useFakeTimers.apply(sinon, arguments);

      return this.add(this.clock);
    }
  });

  if (commonJSModule) {
    module.exports = sandbox;
  } else {
    sinon.sandbox = sandbox;
  }
}(typeof sinon == "object" && sinon || null));
