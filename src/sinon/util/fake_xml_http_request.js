/*jslint indent: 2, eqeqeq: false, onevar: false*/
/*global sinon, module, require*/
/**
 * Fake XMLHttpRequest object
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
if (typeof sinon == "undefined") {
  this.sinon = {};
}

sinon.FakeXMLHttpRequest = (function () {
  var unsafeHeaders = {
    "Accept-Charset": true,
    "Accept-Encoding": true,
    "Connection": true,
    "Content-Length": true,
    "Cookie": true,
    "Cookie2": true,
    "Content-Transfer-Encoding": true,
    "Date": true,
    "Expect": true,
    "Host": true,
    "Keep-Alive": true,
    "Referer": true,
    "TE": true,
    "Trailer": true,
    "Transfer-Encoding": true,
    "Upgrade": true,
    "User-Agent": true,
    "Via": true
  };

  function FakeXMLHttpRequest() {
    this.readyState = FakeXMLHttpRequest.UNSENT;
    this.requestHeaders = {};
    this.requestBody = null;
    this.status = 0;
    this.statusText = "";

    if (typeof FakeXMLHttpRequest.onCreate == "function") {
      FakeXMLHttpRequest.onCreate(this);
    }
  }

  function verifyState(xhr) {
    if (xhr.readyState !== FakeXMLHttpRequest.OPENED) {
      throw new Error("INVALID_STATE_ERR");
    }

    if (xhr.sendFlag) {
      throw new Error("INVALID_STATE_ERR");
    }
  }

  function open(method, url, async, username, password) {
    this.method = method;
    this.url = url;
    this.async = typeof async == "boolean" ? async : true;
    this.username = username;
    this.password = password;
    this.responseText = null;
    this.requestHeaders = {};
    this.sendFlag = false;
    this.readyStateChange(FakeXMLHttpRequest.OPENED);
  }

  function readyStateChange(state) {
    this.readyState = state;

    if (typeof this.onreadystatechange == "function") {
      this.onreadystatechange();
    }
  }

  function setRequestHeader(header, value) {
    verifyState(this);

    if (unsafeHeaders[header] || /^(Sec-|Proxy-)/.test(header)) {
      throw new Error("Refused to set unsafe header \"" + header + "\"");
    }

    if (this.requestHeaders[header]) {
      this.requestHeaders[header] += "," + value; 
    } else {
      this.requestHeaders[header] = value;
    }
  }

  // Currently treats ALL data as a DOMString (i.e. no Document)
  function send(data) {
    verifyState(this);

    if (!/^(get|head)$/i.test(this.method)) {
      if (this.requestHeaders["Content-Type"]) {
        var value = this.requestHeaders["Content-Type"].split(";");
        this.requestHeaders["Content-Type"] = value[0] + ";charset=utf-8";
      } else {
        this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";
      }

      this.requestBody = data;
    }

    this.errorFlag = false;
    this.sendFlag = this.async;
    this.readyStateChange(FakeXMLHttpRequest.OPENED);

    if (typeof this.onSend == "function") {
      this.onSend(this);
    }
  }

  function abort() {
  }

  function getResponseHeader(header) {
    if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
      return null;
    }

    if (/^Set-Cookie2?$/i.test(header)) {
      return null;
    }

    return this.responseHeaders[header];
  }

  function getAllResponseHeaders() {
    if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
      return null;
    }

    var headers = {};

    for (var header in this.responseHeaders) {
      if (this.responseHeaders.hasOwnProperty(header) &&
          !/^Set-Cookie2?$/.test(header)) {
        headers[header] = this.responseHeaders[header];
      }
    }

    return headers;
  }

  // Helps testing

  function setResponseHeaders(headers) {
    this.responseHeaders = headers;

    if (this.async) {
      this.readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED);
    }
  }

  function setResponseBody(body) {
    if (this.readyState == FakeXMLHttpRequest.DONE) {
      throw new Error("Request done");
    }

    if (this.async && this.readyState != FakeXMLHttpRequest.HEADERS_RECEIVED) {
      throw new Error("No headers received");
    }

    var chunkSize = this.chunkSize || 10;
    var index = 0;
    this.responseText = "";

    do {
      if (this.async) {
        this.readyStateChange(FakeXMLHttpRequest.LOADING);
      }

      this.responseText += body.substring(index, index + chunkSize);
      index += chunkSize;
    } while (index < body.length);

    if (this.async) {
      this.readyStateChange(FakeXMLHttpRequest.DONE);
    } else {
      this.readyState = FakeXMLHttpRequest.DONE;
    }
  }

  function respond(status, headers, body) {
    this.setResponseHeaders(headers || {});
    this.status = typeof status == "number" ? status : 200;
    this.setResponseBody(body || "");
  }

  sinon.extend(FakeXMLHttpRequest.prototype, {
    async: true,
    open: open,
    readyStateChange: readyStateChange,
    setRequestHeader: setRequestHeader,
    setResponseHeaders: setResponseHeaders,
    send: send,
    abort: abort,
    getResponseHeader: getResponseHeader,
    getAllResponseHeaders: getAllResponseHeaders,
    setResponseBody: setResponseBody,
    respond: respond
  });

  sinon.extend(FakeXMLHttpRequest, {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4
  });

  return FakeXMLHttpRequest;
}());

(function (global) {
  var globalXMLHttpRequest = global.XMLHttpRequest;
  var globalActiveXObject = global.ActiveXObject;

  sinon.useFakeXMLHttpRequest = function () {
    sinon.FakeXMLHttpRequest.restore = function restore(keepOnCreate) {
      global.XMLHttpRequest = globalXMLHttpRequest;
      global.ActiveXObject = globalActiveXObject;
      delete sinon.FakeXMLHttpRequest.restore;

      if (keepOnCreate !== true) {
        delete sinon.FakeXMLHttpRequest.onCreate;
      }
    };

    global.XMLHttpRequest = sinon.FakeXMLHttpRequest;

    global.ActiveXObject = function ActiveXObject(objId) {
      if (objId == "Microsoft.XMLHTTP" || /^Msxml2\.XMLHTTP/.test(objId)) {
        throw new Error("Not supported");
      }

      return new globalActiveXObject(objId);
    };

    return sinon.FakeXMLHttpRequest;
  };
}(this));

if (typeof module == "object" && typeof require == "function") {
  module.exports = sinon;
}
