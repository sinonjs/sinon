---
layout: page
title: Fake XHR and server - Sinon.JS
breadcrumb: fake XHR and server
---

## Fake `XMLHttpRequest`

Provides a fake implementation of `XMLHttpRequest` and provides
several interfaces for manipulating objects created by it.

Also fakes native `XMLHttpRequest` and `ActiveXObject` (when available, and only for `XMLHTTP` progids). Helps with testing requests made with `XHR`.

The fake server and XHR can be used completely stand-alone by downloading `sinon-server.js`.

```javascript
{
    setUp: function () {
        this.xhr = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        this.xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };
    },

    tearDown: function () {
        this.xhr.restore();
    },

    "test should fetch comments from server" : function () {
        var callback = sinon.spy();
        myLib.getCommentsFor("/some/article", callback);
        assertEquals(1, this.requests.length);

        this.requests[0].respond(200, { "Content-Type": "application/json" },
                                 '[{ "id": 12, "comment": "Hey there" }]');
        assert(callback.calledWith([{ id: 12, comment: "Hey there" }]));
    }
}
```

### `sinon.useFakeXMLHttpRequest`

#### `var xhr = sinon.useFakeXMLHttpRequest();`

Causes Sinon to replace the native `XMLHttpRequest` object in browsers that support it with a custom implementation which does not send actual requests.

In browsers that support `ActiveXObject`, this constructor is replaced, and fake objects are returned for `XMLHTTP` progIds. Other progIds, such as `XMLDOM` are left untouched.

The native `XMLHttpRequest` object will be available at `sinon.xhr.XMLHttpRequest`

#### `xhr.onCreate = function (xhr) {};`

By assigning a function to the `onCreate` property of the returned object from `useFakeXMLHttpRequest()` you can subscribe to newly created `FakeXMLHttpRequest` objects. See below for the fake xhr object API.

Using this observer means you can still reach objects created by e.g. `jQuery.ajax` (or other abstractions/frameworks).

#### `xhr.restore();`

Restore original function(s).

### `FakeXMLHttpRequest`

#### `String request.url`

The URL set on the request object.

#### `String request.method`

The request method as a string.

#### `Object request.requestHeaders`

An object of all request headers, i.e.:

```javascript
{
    "Accept": "text/html, */*",
    "Connection": "keep-alive"
}
```

#### `String request.requestBody`

The request body

#### `int request.status`

The request's status code.

`undefined` if the request has not been handled (see [`respond`](#serverrespond) below)

#### `String request.statusText`

Only populated if the [`respond`](#serverrespond) method is called (see below).

#### `boolean request.async`

Whether or not the request is asynchronous.

#### `String request.username`

Username, if any.

#### `String request.password`

Password, if any.

#### `Document request.responseXML`

When using [`respond`](#serverrespond), this property is populated with a parsed document if response headers indicate as much (see [the spec](http://www.w3.org/TR/XMLHttpRequest/))

#### `String request.getResponseHeader(header);`

The value of the given response header, if the request has been responded to (see [`respond`](#serverrespond)).

#### `Object request.getAllResponseHeaders();`

All response headers as an object.

### Filtered requests

When using Sinon.JS for mockups or partial integration/functional testing, you might want to fake some requests, while allowing others to go through to the backend server. With filtered `FakeXMLHttpRequest`s (new in v1.3.0), you can.

#### `FakeXMLHttpRequest.useFilters`

Default `false`.

When set to `true`, Sinon will check added filters if certain requests should be "unfaked"

#### `FakeXMLHttpRequest.addFilter(fn)`

Add a filter that will decide whether or not to fake a request.

The filter will be called when `xhr.open` is called, with the exact same arguments (`method`, `url`, `async`, `username`, `password`). If the filter returns `true`, the request will not be faked.

### Simulating server responses

#### `request.setStatus(status);`

Sets response status (`status` and `statusText` properties).

Status should be a number, the status text is looked up from `sinon.FakeXMLHttpRequest.statusCodes`.

#### `request.setResponseHeaders(object);`

Sets response headers (e.g. `{ "Content-Type": "text/html", /* ... */ }`, updates the `readyState` property and fires `onreadystatechange`.

#### `request.setResponseBody(body);`

Sets the respond body, updates the `readyState` property and fires `onreadystatechange`.

Additionally, populates `responseXML` with a parsed document if [response headers indicate as much](http://www.w3.org/TR/XMLHttpRequest/).

#### `request.respond(status, headers, body);`

Calls the above three methods.

#### `request.error();`

Simulates a network error on the request. The `onerror` handler will be called and the `status` will be `0`.

#### `Boolean request.autoRespond`

When set to `true`, causes the server to automatically respond to incoming requests after a timeout.

The default timeout is 10ms but you can control it through the `autoRespondAfter` property.

Note that this feature is intended to help during mockup development, and is not suitable for use in tests.

#### `Number request.autoRespondAfter`

When `autoRespond` is `true`, respond to requests after this number of milliseconds. Default is 10.

## Fake server

High-level API to manipulate `FakeXMLHttpRequest` instances.

```javascript
// example.test.js in Mocha TDD
var sinon = require("sinon");

suite("sinon.fakeServer", function () {
  setup(function () {
    this.server = sinon.fakeServer.create();
  });

  teardown(function () {
    this.server.restore();
  });

  test("test should fetch comments from server", function () {
    this.server.respondWith("GET", "/some/article/comments.json", [
      200,
      { "Content-Type": "application/json" },
      '[{ "id": 12, "comment": "Hey there" }]',
    ]);

    var callback = sinon.spy();
    myLib.getCommentsFor("/some/article", callback);
    this.server.respond();

    sinon.assert.calledWith(callback, [{ id: 12, comment: "Hey there" }]);

    assert(server.requests.length > 0);
  });
});
```

### Methods

#### `var server = sinon.fakeServer.create([config]);`

Creates a new server.

This function also calls `sinon.useFakeXMLHttpRequest()`.

`create()` accepts an optional properties object to configure the fake server. See [Configuration Properties](#configuration-properties) below for available options.

#### `var server = sinon.fakeServerWithClock.create();`

Creates a server that also manages fake timers.

This is useful when testing `XHR` objects created with e.g. jQuery 1.3.x, which uses a timer to poll the object for completion, rather than the usual `onreadystatechange`.

Just as a `create()` above, an optional properties object can be provided to set configuration parameters during instantiation.

#### `server.configure(config);`

Changes the configuration the fake server after it has been created.

This can be useful for changing the delay of an automatic response for a specific test requirement. For more options, see [Configuration Properties](#configuration-properties) below.

#### `server.respondWith(response);`

Causes the server to respond to any request not matched by another response with the provided data. The default catch-all response is `[404, {}, ""]`.

`response` can be one of three things:

1. A `String` representing the response body
2. An `Array` with status, headers and response body, e.g. `[200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]`
3. A `Function`.

Default status is 200 and default headers are none.

When the response is a `Function`, it will be passed the request object. You
must manually call [respond](#serverrespond) on it to complete the
request.

#### `server.respondWith(url, response);`

Responds to all requests to given URL, e.g. `/posts/1`.

#### `server.respondWith(method, url, response);`

Responds to all `method` requests to the given URL with the given response.

`method` is an HTTP verb.

#### `server.respondWith(urlRegExp, response);`

URL may be a regular expression, e.g. `/\\/post\\//\\d+`

If the response is a `Function`, it will be passed any capture groups from the regular expression along with the XMLHttpRequest object:

```javascript
server.respondWith(/\/todo-items\/(\d+)/, function (xhr, id) {
  xhr.respond(
    200,
    { "Content-Type": "application/json" },
    '[{ "id": ' + id + " }]"
  );
});
```

#### `server.respondWith(method, urlRegExp, response);`

Responds to all `method` requests to URLs matching the regular expression.

#### `server.respond();`

Causes all queued asynchronous requests to receive a response.

If none of the responses added through `respondWith()` match, the default response is `[404, {}, ""]`.

Synchronous requests are responded to immediately so make sure to call `respondWith()` to configure the server response before calling `respond()`. If not, you will receive the default `404 NOT FOUND` response.

If called with arguments, `respondWith()` will be called with those arguments before responding to requests.

#### `server.getHTTPMethod(request)`

Used internally to determine the HTTP method used with the provided request.

By default this method returns `request.method`. When `server.fakeHTTPMethods` is true, the method will return the value of the `_method` parameter if the method is "POST".

This method can be overridden to provide custom behavior.

#### `server.restore();`

Restores the native XHR constructor.

### Properties

#### Array[] `server.requests`

`server.requests` is an array of all the `FakeXMLHttpRequest` objects that have been created.

This property allows you to inspect the received requests to verify request ordering, find unmatched requests or check that no requests has been done.

### Configuration Properties

The Fake Server exposes configurable properties to modify the behavior of the server as desired. These properties can be set directly or with an object literal passed into `create(options)` and/or `server.configure(options)`.

```javascript
// Defaults
server.autoRespond = false;
server.autoRespondAfter = 10; // in milliseconds
server.respondImmediately = false;
server.fakeHTTPMethods = false;

// configure fakeServer to autoRespond
server.autoRespond = true;

// Change server now to respondImmediately
server.configure({ respondImmediately: true });
```

#### Boolean `autoRespond`

If set, will automatically respond to every request after a timeout. **Default: false**.

The default timeout is 10ms but you can control it through the `autoRespondAfter` property.

Note that this feature is intended to help during mockup development, and is not suitable for use in tests. For synchronous immediate responses, use `respondImmediately` instead.

#### Number `autoRespondAfter (ms)`

Causes the server to automatically respond to incoming requests after a timeout. Requires `server.autoRespond` to be set to `true` to have an effect. If `server.respondImmediately` is set to `true`, this setting is ignored.

#### Boolean `respondImmediately`

If set, the server will respond to every request immediately and synchronously. **Default: false**

This is ideal for faking the server from within a test without having to call `server.respond()` after each request made in that test.

As this is synchronous and immediate, this is not suitable for simulating actual network latency in tests or mockups. To simulate network latency with automatic responses, see `autoRespond` and `autoRespondAfter` properties. If `server.respondImmediately == true`, it will override all `autoRespond` behavior.

#### Boolean `fakeHTTPMethods`

If set to `true`, server will find `_method` parameter in POST body and recognize that as the actual method.

Supports a pattern common to Ruby on Rails applications. For custom HTTP method faking, override `server.getHTTPMethod(request)`.
