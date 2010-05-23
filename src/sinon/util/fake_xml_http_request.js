(function (sinon) {
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

  function verifyState(xhr) {
    if (xhr.readyState !== FakeXMLHttpRequest.OPENED) {
      throw new Error("INVALID_STATE_ERR");
    }

    if (xhr.sendFlag) {
      throw new Error("INVALID_STATE_ERR");
    }
  }

  function FakeXMLHttpRequest() {
    this.readyState = FakeXMLHttpRequest.UNSENT;
    this.requestHeaders = {};
    this.requestBody = null;
    this.status = 0;
    this.statusText = "";
  }

  function open(method, url, async, username, password) {
    this.method = method;
    this.url = url;
    this.async = typeof async == "boolean" ? async : true;
    this.username = username;
    this.password = password;
    this.responseText = null;
    this.requestHeaders = {};
    this._send = false;
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

    // Should continue asynchronously if async == true at this point,
    // consider complying
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
    if (!this.sendFlag) {
      throw new Error("INVALID_STATE_ERR");
    }

    this.responseHeaders = headers;
    this.readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED);
  }

  FakeXMLHttpRequest.prototype.open = open;
  FakeXMLHttpRequest.prototype.readyStateChange = readyStateChange;
  FakeXMLHttpRequest.prototype.setRequestHeader = setRequestHeader;
  FakeXMLHttpRequest.prototype.setResponseHeaders = setResponseHeaders;
  FakeXMLHttpRequest.prototype.send = send;
  FakeXMLHttpRequest.prototype.abort = abort;
  FakeXMLHttpRequest.prototype.getResponseHeader = getResponseHeader;
  FakeXMLHttpRequest.prototype.getAllResponseHeaders = getAllResponseHeaders;

  FakeXMLHttpRequest.methods = [];

  FakeXMLHttpRequest.UNSENT = 0;
  FakeXMLHttpRequest.OPENED = 1;
  FakeXMLHttpRequest.HEADERS_RECEIVED = 2;
  FakeXMLHttpRequest.LOADING = 3;
  FakeXMLHttpRequest.DONE = 4;

  if (typeof module == "object" && typeof require == "function") {
    module.FakeXMLHttpRequest = FakeXMLHttpRequest;
  } else {
    sinon.FakeXMLHttpRequest = FakeXMLHttpRequest;
  }
}(typeof sinon == "object" && sinon || {}));
