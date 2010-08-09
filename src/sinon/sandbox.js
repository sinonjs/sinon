/**
 * @depend ../sinon.js
 * @depend collection.js
 * @depend util/fake_timers.js
 * @depend util/fake_server_with_clock.js
 */
/*jslint indent: 2, eqeqeq: false, onevar: false*/
/*global sinon*/
/**
 * Manages fake collections as well as fake utilities such as Sinon's
 * timers and fake XHR implementation in one convenient object.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
(function () {
  if (typeof sinon == "undefined") {
    return;
  }

  sinon.sandbox = sinon.extend(sinon.create(sinon.collection), {
    useFakeTimers: function useFakeTimers() {
      this.clock = sinon.useFakeTimers.apply(sinon, arguments);

      return this.add(this.clock);
    },

    serverPrototype: sinon.fakeServer,

    useFakeServer: function useFakeServer() {
      this.server = (this.serverPrototype || sinon.fakeServer).create();

      return this.add(this.server);
    },

    inject: function (obj) {
      sinon.collection.inject.call(this, obj);

      if (this.clock) {
        obj.clock = this.clock;
      }

      if (this.server) {
        obj.server = this.server;
        obj.requests = this.server.requests;
      }

      return obj;
    }
  });

  sinon.sandbox.useFakeXMLHttpRequest = sinon.sandbox.useFakeServer;
}());
