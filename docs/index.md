---
  layout: homepage
  title: Sinon.JS - Standalone test fakes, spies, stubs and mocks for JavaScript. Works with any unit testing framework.
---

{% assign current_release = site.sinon.current_release %}
{% assign current_major = site.sinon.current_major_version %}

## Get Started

### Install using `npm`

To install the current release (`{{current_release}}`) of Sinon:

```shell
npm install sinon
```

### Setting up access

#### Node and CommonJS build systems

```javascript
var sinon = require("sinon");
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
  import sinon from "./node_modules/sinon/pkg/sinon-esm.js";
</script>
```

## Try It Out

The following function takes a function as its argument and returns a new function. You can call the resulting function as many times as you want, but the original function will only be called once:

```javascript
function once(fn) {
  var returnValue,
    called = false;
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
it("calls the original function", function () {
  var callback = sinon.fake();
  var proxy = once(callback);

  proxy();

  assert(callback.called);
});
```

The fact that the function was only called once is important:

```javascript
it("calls the original function only once", function () {
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
it("calls original function with right this and args", function () {
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
    url: "/todo/" + listId + "/items",
    success: function (data) {
      // Node-style CPS: callback(err, data)
      callback(null, data);
    },
  });
}
```

A unit test should not actually trigger a function's network activity. To test `getTodos()` without triggering its network activity, use the `sinon.replace()` method to replace the `jQuery.ajax` method in your test. Restore the `jQuery.ajax` method after your test by calling `sinon.restore()` in your test runner's `after()` function.

```javascript
after(function () {
  sinon.restore();
});

it("makes a GET request for todo items", function () {
  sinon.replace(jQuery, "ajax", sinon.fake());

  getTodos(42, sinon.fake());

  assert(jQuery.ajax.calledWithMatch({ url: "/todo/42/items" }));
});
```

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

before(function () {
  clock = sinon.useFakeTimers();
});
after(function () {
  clock.restore();
});

it("calls callback after 100ms", function () {
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

- [Stack Overflow](https://stackoverflow.com/questions/tagged/sinon)
- IRC: #sinon.js on freenode

### Sinon.JS elsewhere

- [Testing Backbone applications with Jasmine and Sinon](https://tinnedfruit.com/writing/testing-backbone-apps-with-jasmine-sinon.html)

Sinon's "father", Christian Johansen, wrote the book on [Test-Driven JavaScript Development][tddjs], which covers some of the design philosophy and initial sketches for Sinon.JS.

[fakes]: /releases/v{{current_major}}/fakes
[clock]: /releases/v{{current_major}}/fake-timers
[api-docs]: /releases/v{{current_major}}
[tddjs]: https://www.oreilly.com/library/view/test-driven-javascript-development/9780321684097/
