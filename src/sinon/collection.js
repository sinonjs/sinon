/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 */
/*jslint indent: 2, eqeqeq: false, onevar: false, forin: true*/
/*global module, require, sinon*/
/**
 * Collections of stubs, spies and mocks.
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

  var collection = {
    create: function create() {
      return sinon.extend(sinon.create(collection), {
        fakes: []
      });
    },

    verify: function resolve() {
      for (var i = 0, l = this.fakes.length; i < l; i += 1) {
        if (typeof this.fakes[i].verify == "function") {
          this.fakes[i].verify();
        }
      }
    },

    restore: function restore() {
      for (var i = 0, l = this.fakes.length; i < l; i += 1) {
        if (typeof this.fakes[i].restore == "function") {
          this.fakes[i].restore();
        }
      }
    },

    verifyAndRestore: function verifyAndRestore() {
      var exception;

      try {
        this.verify();
      } catch (e) {
        exception = e;
      }

      this.restore();

      if (exception) {
        throw exception;
      }
    },

    stub: function stub() {
      var fake = sinon.stub.apply(sinon, arguments);
      this.fakes.push(fake);

      return fake;
    },

    mock: function mock() {
      this.fakes.push(sinon.mock.apply(sinon, arguments));

      return this.fakes[this.fakes.length - 1];
    }
  };

  if (commonJSModule) {
    module.exports = collection;
  } else {
    sinon.collection = collection;
  }
}(typeof sinon == "object" && sinon || null));
