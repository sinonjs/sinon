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
(function (sinon) {
  if (!sinon) {
    return;
  }

  sinon.sandbox = sinon.extend(sinon.create(sinon.collection), {
    useFakeTimers: function useFakeTimers() {
      this.clock = sinon.useFakeTimers.apply(sinon, arguments);

      return this.add(this.clock);
    },

    useFakeXMLHttpRequest: function useFakeXMLHttpRequest() {
      this.fakeXMLHttpRequest = sinon.useFakeXMLHttpRequest();

      return this.add(this.fakeXMLHttpRequest);
    },

    serverPrototype: sinon.server,

    useServer: function useServer() {
      this.server = (this.serverPrototype || sinon.server).create();

      return this.add(this.server);
    }
  });
}(typeof sinon == "object" && sinon || null));
