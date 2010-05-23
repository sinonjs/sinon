/*jslint indent: 2, onevar: false*/
/*globals TestCase,
          sinon,
          assert,
          assertSame,
          assertEquals,
          assertTrue,
          assertFalse,
          assertNull,
          assertException,
          assertUndefined,
          assertObject,
          assertFunction*/
(function () {
  var testCase = TestCase; // Avoid JsLint warning

  testCase("FakeXMLHttpRequestTest", {
    "test should be constructor": function () {
      assertFunction(sinon.FakeXMLHttpRequest);
      assertSame(sinon.FakeXMLHttpRequest, sinon.FakeXMLHttpRequest.prototype.constructor);
    },

    "test should implement status constants": function () {
      assertSame(1, sinon.FakeXMLHttpRequest.OPENED);
      assertSame(2, sinon.FakeXMLHttpRequest.HEADERS_RECEIVED);
      assertSame(3, sinon.FakeXMLHttpRequest.LOADING);
      assertSame(4, sinon.FakeXMLHttpRequest.DONE);
    }
  });

  testCase("FakeXMLHttpRequestOpenTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
    },

    "test should be method": function () {
      assertFunction(this.xhr.open);
    },

    "test should set properties on object": function () {
      this.xhr.open("GET", "/my/url", true, "cjno", "pass");

      assertEquals("GET", this.xhr.method);
      assertEquals("/my/url", this.xhr.url);
      assertTrue(this.xhr.async);
      assertEquals("cjno", this.xhr.username);
      assertEquals("pass", this.xhr.password);
    },

    "test should be async by default": function () {
      this.xhr.open("GET", "/my/url");

      assertTrue(this.xhr.async);
    },

    "test should set async to false": function () {
      this.xhr.open("GET", "/my/url", false);

      assertFalse(this.xhr.async);
    },

    "test should set responseText to null": function () {
      this.xhr.open("GET", "/my/url");

      assertNull(this.xhr.responseText);
    },

    "test should set requestHeaders to blank object": function () {
      this.xhr.open("GET", "/my/url");

      assertObject(this.xhr.requestHeaders);
      assertEquals({}, this.xhr.requestHeaders);
    },

    "test should set readyState to OPENED": function () {
      this.xhr.open("GET", "/my/url");

      assertSame(sinon.FakeXMLHttpRequest.OPENED, this.xhr.readyState);
    },

    "test should set send flag to false": function () {
      this.xhr.open("GET", "/my/url");

      assertFalse(this.xhr.sendFlag);
    },

    "test should dispatch onreadystatechange with reset state": function () {
      var state = {};

      this.xhr.onreadystatechange = function () {
        sinon.extend(state, this);
      };

      this.xhr.open("GET", "/my/url");

      assertEquals("GET", state.method);
      assertEquals("/my/url", state.url);
      assertTrue(state.async);
      assertUndefined(state.username);
      assertUndefined(state.password);
      assertNull(state.responseText);
      assertEquals({}, state.responseHeaders);
      assertEquals(sinon.FakeXMLHttpRequest.OPENED, state.readyState);
      assertFalse(state.sendFlag);
    }
  });

  testCase("setRequestHeader", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
      this.xhr.open("GET", "/");
    },

    "test should throw exception if readyState is not OPENED": function () {
      var xhr = new sinon.FakeXMLHttpRequest();

      assertException(function () {
        xhr.setRequestHeader("X-EY", "No-no");
      });
    },

    "test should throw exception if send fag is true": function () {
      var xhr = this.xhr;
      xhr.sendFlag = true;

      assertException(function () {
        xhr.setRequestHeader("X-EY", "No-no");
      });
    },

    "test should disallow unsafe headers": function () {
      var xhr = this.xhr;

      assertException(function () {
        xhr.setRequestHeader("Accept-Charset", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Accept-Encoding", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Connection", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Content-Length", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Cookie", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Cookie2", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Content-Transfer-Encoding", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Date", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Expect", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Host", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Keep-Alive", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Referer", "");
      });

      assertException(function () {
        xhr.setRequestHeader("TE", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Trailer", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Transfer-Encoding", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Upgrade", "");
      });

      assertException(function () {
        xhr.setRequestHeader("User-Agent", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Via", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Proxy-Oops", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Sec-Oops", "");
      });
    },

    "test should set header and value": function () {
      this.xhr.setRequestHeader("X-Fake", "Yeah!");

      assertEquals({ "X-Fake": "Yeah!" }, this.xhr.requestHeaders);
    },

    "test should append same-named header values": function () {
      this.xhr.setRequestHeader("X-Fake", "Oh");
      this.xhr.setRequestHeader("X-Fake", "yeah!");

      assertEquals({ "X-Fake": "Oh,yeah!" }, this.xhr.requestHeaders);
    }
  });

  testCase("FakeXMLHttpRequestSendTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
    },

    "test should throw if request is not open": function () {
      var xhr = new sinon.FakeXMLHttpRequest();

      assertException(function () {
        xhr.send();
      });
    },

    "test should throw if send flag is true": function () {
      var xhr = this.xhr;
      xhr.open("GET", "/");
      xhr.sendFlag = true;

      assertException(function () {
        xhr.send();
      });
    },

    "test should set GET body to null": function () {
      this.xhr.open("GET", "/");
      this.xhr.send("Data");

      assertNull(this.xhr.requestBody);
    },

    "test should set HEAD body to null": function () {
      this.xhr.open("HEAD", "/");
      this.xhr.send("Data");

      assertNull(this.xhr.requestBody);
    },

    "test should set mime to text/plain": function () {
      this.xhr.open("POST", "/");
      this.xhr.send("Data");

      assertEquals("text/plain;charset=utf-8", this.xhr.requestHeaders["Content-Type"]);
    },

    "test should not override mime": function () {
      this.xhr.open("POST", "/");
      this.xhr.setRequestHeader("Content-Type", "text/html");
      this.xhr.send("Data");

      assertEquals("text/html;charset=utf-8", this.xhr.requestHeaders["Content-Type"]);
    },

    "test should set request body to string data": function () {
      this.xhr.open("POST", "/");
      this.xhr.send("Data");

      assertEquals("Data", this.xhr.requestBody);
    },

    "test should set error flag to false": function () {
      this.xhr.open("POST", "/");
      this.xhr.send("Data");

      assertFalse(this.xhr.errorFlag);
    },

    "test should set send flag to true": function () {
      this.xhr.open("POST", "/");
      this.xhr.send("Data");

      assertTrue(this.xhr.sendFlag);
    },

    "test should not set send flag to true if sync": function () {
      this.xhr.open("POST", "/", false);
      this.xhr.send("Data");

      assertFalse(this.xhr.sendFlag);
    },

    "test should dispatch onreadystatechange": function () {
      var state;
      this.xhr.open("POST", "/", false);

      this.xhr.onreadystatechange = function () {
        state = this.readyState;
      };

      this.xhr.send("Data");

      assertEquals(sinon.FakeXMLHttpRequest.OPENED, state);
    }
  });

  testCase("FakeXMLHttpRequestSetResponseHeadersTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
      this.xhr.open("GET", "/");
    },

    "test should set request headers": function () {
      var object = { id: 42 };
      this.xhr.send();
      this.xhr.setResponseHeaders(object);

      assertSame(object, this.xhr.responseHeaders);
    },

    "test should throw if send flag is not set": function () {
      var object = { id: 42 };
      var xhr = this.xhr;

      assertException(function () {
        xhr.setResponseHeaders(object);
      });
    },

    "test should call readyStateChange with HEADERS_RECEIVED": function () {
      var object = { id: 42 };
      this.xhr.send();
      var stub = this.xhr.readyStateChange = sinon.stub.create();

      this.xhr.setResponseHeaders(object);

      assert(stub.calledWith(sinon.FakeXMLHttpRequest.HEADERS_RECEIVED));
    }
  });

  testCase("FakeXMLHttpRequestGetResponseHeaderTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
      this.xhr.open("GET", "/");
    },

    "test should return null if request is not finished": function () {
      assertNull(this.xhr.getResponseHeader("Content-Type"));
    },

    "test should return null if header is Set-Cookie": function () {
      this.xhr.send();

      assertNull(this.xhr.getResponseHeader("Set-Cookie"));
    },

    "test should return null if header is Set-Cookie2": function () {
      this.xhr.send();

      assertNull(this.xhr.getResponseHeader("Set-Cookie2"));
    },

    "test should return header value": function () {
      this.xhr.send();
      this.xhr.setResponseHeaders({ "Content-Type": "text/html" });

      assertEquals("text/html", this.xhr.getResponseHeader("Content-Type"));
    },

    "test should return null if header is not set": function () {
      this.xhr.send();

      assertNull(this.xhr.getResponseHeader("Content-Type"));
    }
  });

  testCase("FakeXMLHttpRequestGetAllResponseHeadersTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
      this.xhr.open("GET", "/");
    },

    "test should return null if request is not finished": function () {
      assertNull(this.xhr.getAllResponseHeaders());
    },

    "test should not return Set-Cookie and Set-Cookie2 headers": function () {
      this.xhr.send();
      this.xhr.setResponseHeaders({
        "Set-Cookie": "Hey",
        "Set-Cookie2": "There"
      });

      assertEquals({}, this.xhr.getAllResponseHeaders());
    },

    "test should return headers": function () {
      this.xhr.send();
      this.xhr.setResponseHeaders({
        "Content-Type": "text/html",
        "Set-Cookie2": "There",
        "Content-Length": "32"
      });

      assertEquals({
        "Content-Type": "text/html",
        "Content-Length": "32"
      }, this.xhr.getAllResponseHeaders());
    }
  });
}());
