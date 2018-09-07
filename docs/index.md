---
  layout: homepage
  title: Sinon.JS - Standalone test fakes, spies, stubs and mocks for JavaScript. Works with any unit testing framework.
---
{% assign current_release = site.sinon.current_release %}

## Get Started

### Install using `npm`

To install the current release (`{{current_release}}`) of Sinon:

```shell
npm install sinon
```

### Setting up access

#### Node and CommonJS build systems

```javascript
var sinon = require('sinon');
```

#### Direct browser use

```html
<script src="./node_modules/sinon/pkg/sinon.js"></script>
<script>
// Access the `sinon` global...

</script>
```

Or in an ES6 Modules environment (modern browsers only)

```html
<script type="module">
import sinon from './node_modules/sinon/pkg/sinon-esm.js';

</script>
```

## Try It Out
The following function takes a function as its argument and returns a new function. You can call the resulting function as many times as you want, but the original function will only be called once:

```javascript
function once(fn) {
    var returnValue, called = false;
    return function () {
        if (!called) {
            called = true;
            returnValue = fn.apply(this, arguments);
        }
        return returnValue;
    };
}
```

### Fakes

Testing this function can be quite elegantly achieved with a [test fake][fakes]:

```javascript
it('calls the original function', function () {
    var callback = sinon.fake();
    var proxy = once(callback);

    proxy();

    assert(callback.called);
});
```

The fact that the function was only called once is important:

```javascript
it('calls the original function only once', function () {
    var callback = sinon.fake();
    var proxy = once(callback);

    proxy();
    proxy();

    assert(callback.calledOnce);
    // ...or:
    // assert.equals(callback.callCount, 1);
});
```

We also care about the `this` value and arguments:

```javascript
it('calls original function with right this and args', function () {
    var callback = sinon.fake();
    var proxy = once(callback);
    var obj = {};

    proxy.call(obj, 1, 2, 3);

    assert(callback.calledOn(obj));
    assert(callback.calledWith(1, 2, 3));
});
```

[Learn more about fakes][fakes].

### Behavior

The function returned by `once` should return whatever the original function returns. To test this, we create a fake with behavior:

```javascript
it("returns the return value from the original function", function () {
    var callback = sinon.fake.returns(42);
    var proxy = once(callback);

    assert.equals(proxy(), 42);
});
```

Conveniently, we can query fakes for their `callCount`, received args and more.

[Learn more about fakes][fakes].

### Testing Ajax

The following function triggers network activity:

```javascript
function getTodos(listId, callback) {
    jQuery.ajax({
        url: '/todo/' + listId + '/items',
        success: function (data) {
            // Node-style CPS: callback(err, data)
            callback(null, data);
        }
    });
}
```

To test this function without triggering network activity we could replace `jQuery.ajax`

```javascript
after(function () {
    // When the test either fails or passes, restore the original
    // jQuery ajax function (Sinon.JS also provides tools to help
    // test frameworks automate clean-up like this)
    jQuery.ajax.restore();
});

it('makes a GET request for todo items', function () {
    sinon.replace(jQuery, 'ajax', sinon.fake());
    getTodos(42, sinon.fake());

    assert(jQuery.ajax.calledWithMatch({ url: '/todo/42/items' }));
});
```

### Fake XMLHttpRequest

While the preceding test shows off some nifty Sinon.JS tricks, it is too tightly coupled to the implementation. When testing Ajax, it is better to use Sinon.JS' [fake XMLHttpRequest][fakexhr]:

```javascript
var xhr, requests;

before(function () {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function (req) { requests.push(req); };
});

after(function () {
    // Like before we must clean up when tampering with globals.
    xhr.restore();
});

it("makes a GET request for todo items", function () {
    getTodos(42, sinon.fake());

    assert.equals(requests.length, 1);
    assert.match(requests[0].url, "/todo/42/items");
});
```

Learn more about [fake XMLHttpRequest][fakexhr].

### Fake server

The preceding example shows how flexible this API is. If it looks too laborous, you may like the fake server:

```javascript
var server;

before(function () { server = sinon.fakeServer.create(); });
after(function () { server.restore(); });

it("calls callback with deserialized data", function () {
    var callback = sinon.fake();
    getTodos(42, callback);

    // This is part of the FakeXMLHttpRequest API
    server.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify([{ id: 1, text: "Provide examples", done: true }])
    );

    assert(callback.calledOnce);
});
```

Test framework integration can typically reduce boilerplate further. [Learn more about the fake server][fakeServer].

### Faking time

> "I don't always bend time and space in unit tests, but when I do, I use Buster.JS + Sinon.JS"

_[Brian Cavalier, Cujo.JS](https://twitter.com/briancavalier/status/225617077346635776)_

Testing time-sensitive logic without the wait is a breeze with Sinon.JS. The following function debounces another function - only when it has not been called for 100 milliseconds will it call the original function with the last set of arguments it received.

```javascript
function debounce(callback) {
    var timer;
    return function () {
        clearTimeout(timer);
        var args = [].slice.call(arguments);
        timer = setTimeout(function () {
            callback.apply(this, args);
        }, 100);
    };
}
```

Thanks to Sinon.JS' time-bending abilities, testing it is easy:

```javascript
var clock;

before(function () { clock = sinon.useFakeTimers(); });
after(function () { clock.restore(); });

it('calls callback after 100ms', function () {
    var callback = sinon.fake();
    var throttled = debounce(callback);

    throttled();

    clock.tick(99);
    assert(callback.notCalled);

    clock.tick(1);
    assert(callback.calledOnce);

    // Also:
    // assert.equals(new Date().getTime(), 100);
});
```

As before, Sinon.JS provides utilities that help test frameworks reduce the boiler-plate. [Learn more about fake time][clock].

### And all the rest…

You've seen the most common tasks people tackle with Sinon.JS, yet we've only scratched the surface. View more quick examples below, or dive into the [API docs][api-docs], which also provides useful pointers on how and when to use the various functionality.

### Get help

* [Stack Overflow](https://stackoverflow.com/questions/tagged/sinon)
* IRC: #sinon.js on freenode

### Sinon.JS elsewhere

* [Testing Backbone applications with Jasmine and Sinon](http://tinnedfruit.com/2011/03/03/testing-backbone-apps-with-jasmine-sinon.html)
* [Sinon.JS fake server live demo](https://github.com/ducin/sinon-backend-less-demo)

Christian Johansen's book [Test-Driven JavaScript Development][tddjs] covers some of the design philosophy and initial sketches for Sinon.JS.

[fakes]: /releases/{{current_release}}/fakes
[fakexhr]: /releases/{{current_release}}/fake-xhr-and-server
[fakeServer]: /releases/{{current_release}}/fake-xhr-and-server#fake-server
[clock]: /releases/{{current_release}}/fake-timers
[api-docs]: /releases/{{current_release}}
[tddjs]: http://tddjs.com/
