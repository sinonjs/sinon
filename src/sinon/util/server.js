/**
 * @depend fake_xml_http_request.js
 */
/*jslint indent: 2, eqeqeq: false, onevar: false*/
/*global sinon, module, require*/
/**
 * The Sinon "server" mimics a web server that receives requests from
 * sinon.FakeXMLHttpRequest and provides an API to respond to those requests,
 * both synchronously and asynchronously. To respond synchronuously, canned
 * answers have to be provided upfront.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
if (typeof sinon == "undefined") {
  this.sinon = {};
}

sinon.server = (function () {
  function F() {}

  function create(proto) {
    F.prototype = proto;
    return new F();
  }

  return {
    create: function () {
      var server = create(this);
      var xhr = sinon.useFakeXMLHttpRequest();
      server.restore = xhr.restore;
      server.requests = [];

      xhr.onCreate = function (xhrObj) {
        server.requests.push(xhrObj);
      };

      return server;
    }
  };
}());

if (typeof module == "object" && typeof require == "function") {
  module.exports = sinon;
}
