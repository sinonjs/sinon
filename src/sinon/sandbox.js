/**
 * @depend ../sinon.js
 * @depend collection.js
 * @depend util/timers.js
 * @depend util/server_with_clock.js
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

    serverPrototype: sinon.server,

    useServer: function useServer() {
      this.server = (this.serverPrototype || sinon.server).create();

      return this.add(this.server);
    },

    inject: function (obj) {
      sinon.collection.call(this, obj);

      if (this.clock) {
        obj.clock = this.clock;
      }

      if (this.server) {
        obj.server = this.server;
        obj.requests = this.server.requests;
      }
    }
  });

  sinon.sandbox.useFakeXMLHttpRequest = sinon.sandbox.useServer;
}());
