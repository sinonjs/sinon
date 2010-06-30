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

  function responseArray(strOrArray) {
    if (sinon.isArray(strOrArray)) {
      return strOrArray;
    }

    return [200, {}, strOrArray];
  }

  var responder = {
    match: function (request) {
      var matchMethod = !this.method || this.method == request.method;
      var url = request.url;
      var matchUrl = typeof this.url.test == "function" && this.url.test(url) || this.url == url;

      return matchMethod && matchUrl;
    }
  };

  return {
    create: function () {
      var server = create(this);
      var xhr = sinon.useFakeXMLHttpRequest();
      server.restore = xhr.restore;
      server.requests = [];

      xhr.onCreate = function (xhrObj) {
        server.requests.push(xhrObj);

        xhrObj.onSend = function () {
          server.handleRequest(this);
        };
      };

      return server;
    },

    handleRequest: function handleRequest(xhr) {
      if (xhr.async) {
        if (!this.queue) {
          this.queue = [];
        }

        this.queue.push(xhr);
      } else {
        this.processRequest(xhr);
      }
    },

    respondWith: function respondWith(method, url, body) {
      if (arguments.length == 1) {
        this.response = responseArray(method);
      } else {
        if (!this.responses) {
          this.responses = [];
        }

        if (arguments.length == 2) {
          body = url;
          url = method;
          method = null;
        }

        this.responses.push(sinon.extend(sinon.create(responder), {
          method: method,
          url: url,
          response: responseArray(body)
        }));
      }
    },

    processQueue: function processQueue() {
      for (var i = 0, l = this.queue.length; i < l; i++) {
        this.processRequest(this.queue[i]);
      }
    },

    processRequest: function processRequest(request) {
      var response = this.response || [404, {}, ""];

      if (this.responses) {
        for (var i = 0, l = this.responses.length; i < l; i++) {
          if (this.responses[i].match(request)) {
            response = this.responses[i].response;
            break;
          }
        }
      }

      request.respond(response[0], response[1], response[2]);
    }
  };
}());

if (typeof module == "object" && typeof require == "function") {
  module.exports = sinon;
}
