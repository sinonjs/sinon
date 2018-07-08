---
layout: page
title: Spies - Sinon.JS
breadcrumb: spies
---

## Introduction

### What is a test spy?

A test spy is a function that records arguments, return value, the value of
`this` and exception thrown (if any) for all its [calls][call]. There are two types of spies:
Some are anonymous functions, while others wrap methods that already exist in
the system under test.


### Creating a spy as an anonymous function

When the behavior of the spied-on function is not under test, you can use an
anonymous function spy. The spy won't do anything except record information
about its [calls][call]. A common use case for this type of spy is testing how a function
handles a callback, as in the following simplified example:

```javascript
"test should call subscribers on publish": function () {
    var callback = sinon.spy();
    PubSub.subscribe("message", callback);

    PubSub.publishSync("message");

    assertTrue(callback.called);
}
```


### Using a spy to wrap an existing method

`sinon.spy(object, "method")` creates a spy that wraps the existing function
`object.method`. The spy will behave exactly like the original method
(including when used as a constructor), but you will have access to data about
all [calls][call]. The following is a slightly contrived example:

```javascript
{
    setUp: function () {
        sinon.spy(jQuery, "ajax");
    },

    tearDown: function () {
        jQuery.ajax.restore(); // Unwraps the spy
    },

    "test should inspect jQuery.getJSON's usage of jQuery.ajax": function () {
        jQuery.getJSON("/some/resource");

        assert(jQuery.ajax.calledOnce);
        assertEquals("/some/resource", jQuery.ajax.getCall(0).args[0].url);
        assertEquals("json", jQuery.ajax.getCall(0).args[0].dataType);
    }
}
```


### Creating spies: `sinon.spy()` Method Signatures

<dl>
  <dt><code>var spy = sinon.spy();</code></dt>
  <dd>
    Creates an anonymous function that records arguments, <code>this</code> value,
    exceptions and return values for all calls.
  </dd>
  <dt><code>var spy = sinon.spy(myFunc);</code></dt>
  <dd>Spies on the provided function</dd>
  <dt><code>var spy = sinon.spy(object, "method");</code></dt>
  <dd>
    Creates a spy for <code>object.method</code> and
    replaces the original method with the spy. An exception is thrown if the property
    is not already a function. The spy acts exactly like the original method in
    all cases. The original method can be restored by calling
    <code>object.method.restore()</code>. The returned spy is the function
    object which replaced the original method. <code>spy === object.method</code>.
  </dd>
</dl>


### Spy API

Spies provide a rich interface to inspect their usage. The above examples showed
the `calledOnce` boolean property as well as the `getCall` method and the
returned object's `args` property. There are three ways of inspecting [call][call] data.

The preferred approach is to use the spy's `calledWith` method (and friends)
because it keeps your test from being too specific about which call did what and
so on. It will return `true` if the spy was ever called with the provided
arguments.

```javascript
"test should call subscribers with message as first argument" : function () {
    var message = 'an example message';
    var spy = sinon.spy();

    PubSub.subscribe(message, spy);
    PubSub.publishSync(message, "some payload");

    assert(spy.calledWith(message));
}
```

If you want to be specific, you can directly check the first argument of the
first [call][call]. There are two ways of achieving this:

```javascript
"test should call subscribers with message as first argument" : function () {
    var message = 'an example message';
    var spy = sinon.spy();

    PubSub.subscribe(message, spy);
    PubSub.publishSync(message, "some payload");

    assertEquals(message, spy.args[0][0]);
}
```

```javascript
"test should call subscribers with message as first argument" : function () {
    var message = 'an example message';
    var spy = sinon.spy();

    PubSub.subscribe(message, spy);
    PubSub.publishSync(message, "some payload");

    assertEquals(message, spy.getCall(0).args[0]);
}
```

The first example uses the two-dimensional `args` array directly on the spy,
while the second example fetches the first [call][call] object and then accesses its
`args` array. Which one to use is a matter of preference, but the recommended
approach is going with `spy.calledWith(arg1, arg2, ...)` unless there's a need
to make the tests highly specific.


## API

Spy objects are objects returned from `sinon.spy()`. When spying on existing
methods with `sinon.spy(object, method)`, the following properties and methods
are also available on `object.method`.

### Properties


#### `spy.withArgs(arg1[, arg2, ...]);`

Creates a spy that only records [calls][call] when the received arguments match those passed to `withArgs`. This is useful to be more expressive in your assertions, where you can access the spy with the same [call][call].

```javascript
"should call method once with each argument": function () {
    var object = { method: function () {} };
    var spy = sinon.spy(object, "method");
    spy.withArgs(42);
    spy.withArgs(1);

    object.method(42);
    object.method(1);

    assert(spy.withArgs(42).calledOnce);
    assert(spy.withArgs(1).calledOnce);
}
```


#### `spy.callCount`

The number of recorded [calls][call].


#### `spy.called`

`true` if the spy was called at least once


#### `spy.notCalled`

`true` if the spy was not called


#### `spy.calledOnce`

`true` if spy was called exactly once


#### `spy.calledTwice`

`true` if the spy was called exactly twice


#### `spy.calledThrice`

`true` if the spy was called exactly thrice


#### `spy.firstCall`

The first [call][call]


#### `spy.secondCall`

The second [call][call]


#### `spy.thirdCall`

The third [call][call]


#### `spy.lastCall`

The last [call][call]


#### `spy.calledBefore(anotherSpy);`

Returns `true` if the spy was called before `anotherSpy`


#### `spy.calledAfter(anotherSpy);`

Returns `true` if the spy was called after `anotherSpy`


#### `spy.calledOn(obj);`

Returns `true` if the spy was called at least once with `obj` as `this`. `calledOn` also accepts a matcher `spyCall.calledOn(sinon.match(fn))` (see [matchers][matchers]).


#### `spy.alwaysCalledOn(obj);`

Returns `true` if the spy was always called with `obj` as `this`.


#### `spy.calledWith(arg1, arg2, ...);`

Returns `true` if spy was called at least once with the provided arguments.

Can be used for partial matching, Sinon only checks the provided arguments against actual arguments, so a call that received the provided arguments (in the same spots) and possibly others as well will return `true`.


#### `spy.alwaysCalledWith(arg1, arg2, ...);`

Returns `true` if spy was always called with the provided arguments (and possibly others).


#### `spy.calledWithExactly(arg1, arg2, ...);`

Returns `true` if spy was called at least once with the provided arguments and no others.


#### `spy.alwaysCalledWithExactly(arg1, arg2, ...);`

Returns `true` if spy was always called with the exact provided arguments.


#### `spy.calledWithMatch(arg1, arg2, ...);`

Returns `true` if spy was called with matching arguments (and possibly others).

This behaves the same as `spy.calledWith(sinon.match(arg1), sinon.match(arg2), ...)`.


#### `spy.alwaysCalledWithMatch(arg1, arg2, ...);`

Returns `true` if spy was always called with matching arguments (and possibly others).

This behaves the same as `spy.alwaysCalledWith(sinon.match(arg1), sinon.match(arg2), ...)`.


#### `spy.calledWithNew();`

Returns `true` if spy/stub was called the `new` operator.

Beware that this is inferred based on the value of the `this` object and the spy function's `prototype`, so it may give false positives if you actively return the right kind of object.


#### `spy.neverCalledWith(arg1, arg2, ...);`

Returns `true` if the spy/stub was never called with the provided arguments.


#### `spy.neverCalledWithMatch(arg1, arg2, ...);`

Returns `true` if the spy/stub was never called with matching arguments.

This behaves the same as `spy.neverCalledWith(sinon.match(arg1), sinon.match(arg2), ...)`.


#### `spy.threw();`

Returns `true` if spy threw an exception at least once.


#### `spy.threw("TypeError");`

Returns `true` if spy threw an exception of the provided type at least once.


#### `spy.threw(obj);`

Returns `true` if spy threw the provided exception object at least once.


#### `spy.alwaysThrew();`

Returns `true` if spy always threw an exception.


#### `spy.alwaysThrew("TypeError");`

Returns `true` if spy always threw an exception of the provided type.


#### `spy.alwaysThrew(obj);`

Returns `true` if spy always threw the provided exception object.


#### `spy.returned(obj);`

Returns `true` if spy returned the provided value at least once.

Uses deep comparison for objects and arrays. Use `spy.returned(sinon.match.same(obj))` for strict comparison (see [matchers][matchers]).


#### `spy.alwaysReturned(obj);`

Returns `true` if spy always returned the provided value.


#### `var spyCall = spy.getCall(n);`

Returns the *nth* [call](#spycall).

Accessing individual calls helps with more detailed behavior verification when the spy is called more than once.

```javascript
sinon.spy(jQuery, "ajax");
jQuery.ajax("/stuffs");
var spyCall = jQuery.ajax.getCall(0);

assertEquals("/stuffs", spyCall.args[0]);
```


#### `var spyCalls = spy.getCalls();`

Returns an `Array` of all [calls][call] recorded by the spy.


#### `spy.thisValues`

Array of `this` objects, `spy.thisValues[0]` is the `this` object for the first [call][call].


#### `spy.args`

Array of arguments received, `spy.args[0]` is an array of arguments received in the first [call][call].


#### `spy.exceptions`

Array of exception objects thrown, `spy.exceptions[0]` is the exception thrown by the first [call][call].

If the call did not throw an error, the value at the call's location in `.exceptions` will be `undefined`.


#### `spy.returnValues`

Array of return values, `spy.returnValues[0]` is the return value of the first [call][call].

If the call did not explicitly return a value, the value at the call's location in `.returnValues` will be `undefined`.


#### `spy.reset()`

Resets the state of a spy.


#### `spy.restore()`

Replaces the spy with the original method. Only available if the spy replaced an existing method.


#### `spy.printf("format string", [arg1, arg2, ...])`

Returns the passed format string with the following replacements performed:

<dl>
    <dt><code>%n</code></dt>
    <dd>the name of the spy "spy" by default)</dd>

    <dt><code>%c</code></dt>
    <dd>the number of times the spy was called, in words ("once", "twice", etc.)</dd>
    <dt><code>%C</code></dt>
    <dd>a list of string representations of the calls to the spy, with each call prefixed by a newline and four spaces</dd>

    <dt><code>%t</code></dt>
    <dd>a comma-delimited list of <code>this</code> values the spy was called on</dd>

    <dt><code>%<var>n</var></code></dt>
    <dd>the formatted value of the <var>n</var>th argument passed to <code>printf</code></dd>

    <dt><code>%*</code></dt>
    <dd>a comma-delimited list of the (non-format string) arguments passed to <code>printf</code></dd>
</dl>


[call]: ../spy-call
[matchers]: ../matchers
