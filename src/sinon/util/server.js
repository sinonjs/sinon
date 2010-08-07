/**
 * @depend fake_xml_http_request.js
 */
/*jslint indent: 2, eqeqeq: false, onevar: false, regexp: false, plusplus: false*/
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
    if (Object.prototype.toString.call(strOrArray) == "[object Array]") {
      return strOrArray;
    }

    return [200, {}, strOrArray];
  }

  function match(response, requestMethod, requestUrl) {
    var matchMethod = !response.method || response.method.toLowerCase() == requestMethod.toLowerCase();
    var url = response.url;
    var matchUrl = !url || url == requestUrl || (typeof url.test == "function" && url.test(requestUrl));

    return matchMethod && matchUrl;
  }

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

    getHTTPMethod: function (request) {
      if (this.fakeHTTPMethods) {
        var match = request.requestBody.match(/_method=([^\b;]+)/);
        return !!match ? match[1] : request.method;
      }

      return request.method;
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

        this.responses.push({
          method: method,
          url: url,
          response: responseArray(body)
        });
      }
    },

    respond: function respond() {
      var queue = this.queue || [];

      for (var i = 0, l = queue.length; i < l; i++) {
        this.processRequest(queue[i]);
      }

      if (this.clock && typeof this.clock.tick == "function") {
        this.clock.tick(this.tickMsOnRespond || 13);
      }
    },

    processRequest: function processRequest(request) {
      if (request.aborted) {
        return;
      }

      var response = this.response || [404, {}, ""];

      if (this.responses) {
        for (var i = 0, l = this.responses.length; i < l; i++) {
          if (match(this.responses[i], this.getHTTPMethod(request), request.url)) {
            response = this.responses[i].response;
            break;
          }
        }
      }

      request.respond(response[0], response[1], response[2]);
    },

    handleAndPassTime: function handleAndPassTime() {
      this.clock = sinon.useFakeTimers();

      var oldRestore = this.restore;

      this.restore = function () {
        oldRestore.apply(this, arguments);
        this.clock.restore();
      };
    }
  };
}());

if (typeof module == "object" && typeof require == "function") {
  module.exports = sinon;
}
