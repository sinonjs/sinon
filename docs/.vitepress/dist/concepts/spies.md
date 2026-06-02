---
url: /concepts/spies.md
description: >-
  Test spies that record arguments, return values, and exceptions for all calls.
  Wrap existing methods or create anonymous spies.
---

# Spies

## Introduction

::: warning Consider Using Fakes Instead
[Fakes][fakes] are the recommended alternative to spies. They provide the same functionality with a simpler, more consistent API. Consider using `sinon.fake()` instead of `sinon.spy()` for new code.
:::

## What is a test spy?

A test spy is a function that records arguments, return value, the value of
`this` and exception thrown (if any) for all its [calls][call]. There are two types of spies:
Some are anonymous functions, while others wrap methods that already exist in
the system under test.

## Creating a spy as an anonymous function

When the behavior of the spied-on function is not under test, you can use an
anonymous function spy. The spy won't do anything except record information
about its [calls][call]. A common use case for this type of spy is testing how a function
handles a callback, as in the following simplified example:

```js
import t from "tap";
import sinon from "sinon";

t.test("anonymous spy records calls and can be asserted", (t) => {
  const spy = sinon.spy();

  // Verify that sinon.assert throws when spy hasn't been called
  t.throws(
    () => sinon.assert.calledOnce(spy),
    /expected spy to be called once but was called 0 times/i,
    "should throw when spy not called"
  );

  // Call the spy
  spy();

  // Now the assertion passes
  t.doesNotThrow(
    () => sinon.assert.calledOnce(spy),
    "should not throw when spy called once"
  );

  t.end();
});

```

## Using a spy to wrap all object method

`sinon.spy(object)`

Spies all the object's methods.

Note that it's usually better practice to spy individual methods, particularly on objects that you don't understand or control all the methods for (e.g. library dependencies).

Spying individual methods tests intent more precisely and is less susceptible to unexpected behavior as the object's code evolves.

The following is a slightly contrived example:

```js
import t from "tap";
import sinon from "sinon";

t.test("spying on all object methods", (t) => {
  // External library example
  const myExternalLibrary = {
    getJSON(url) {
      return this._doNetworkCall({ url: url, dataType: "json" });
    },
    _doNetworkCall(httpParams) {
      return { result: 42 };
    }
  };

  const sandbox = sinon.createSandbox();
  sandbox.spy(myExternalLibrary);

  // Call the method
  const url = "https://jsonplaceholder.typicode.com/todos/1";
  myExternalLibrary.getJSON(url);

  // Verify both methods were spied on and called
  t.ok(myExternalLibrary.getJSON.calledOnce, "getJSON should be called once");
  t.ok(
    myExternalLibrary._doNetworkCall.calledOnce,
    "_doNetworkCall should be called once"
  );
  t.equal(
    myExternalLibrary._doNetworkCall.getCall(0).args[0].url,
    url,
    "url should match"
  );
  t.equal(
    myExternalLibrary._doNetworkCall.getCall(0).args[0].dataType,
    "json",
    "dataType should be json"
  );

  sandbox.restore();
  t.end();
});

```

## Using a spy to wrap an existing method

`sinon.spy(object, "method")` creates a spy that wraps the existing function
`object.method`. The spy will behave exactly like the original method
(including when used as a constructor), but you will have access to data about
all [calls][call]. The following is a slightly contrived example:

```js
import t from "tap";
import sinon from "sinon";

t.test("spying on an existing method", (t) => {
  // Mock a simple object with a method
  const myObject = {
    ajax(config) {
      // Simulate an ajax call
      return { data: "response" };
    },
    getJSON(url) {
      return this.ajax({ url: url, dataType: "json" });
    }
  };

  const sandbox = sinon.createSandbox();
  sandbox.spy(myObject, "ajax");

  // Call getJSON which internally uses ajax
  const url = "https://jsonplaceholder.typicode.com/todos/1";
  myObject.getJSON(url);

  // Verify ajax was called correctly
  t.ok(myObject.ajax.calledOnce, "ajax should be called once");
  t.equal(myObject.ajax.getCall(0).args[0].url, url, "url should match");
  t.equal(
    myObject.ajax.getCall(0).args[0].dataType,
    "json",
    "dataType should be json"
  );

  sandbox.restore();
  t.end();
});

```

## Using a spy to wrap property getter and setter

`sinon.spy(object, "property", ["get", "set"])` creates spies that wrap the
getters and setters for `object.property`. The spies will behave exactly like
the original getters and setters, but you will have access to data about all
[calls][call]. Example:

```js
import t from "tap";
import sinon from "sinon";

t.test("spying on property getter and setter", (t) => {
  const object = {
    _property: undefined,
    get test() {
      return this._property;
    },
    set test(value) {
      this._property = value * 2;
    }
  };

  const spy = sinon.spy(object, "test", ["get", "set"]);

  // Set the property
  object.test = 42;

  // Verify setter was called
  t.ok(spy.set.calledOnce, "setter should be called once");

  // Get the property
  const result = object.test;

  // Verify getter was called and value is correct
  t.equal(result, 84, "value should be doubled");
  t.ok(spy.get.calledOnce, "getter should be called once");

  spy.get.restore();
  spy.set.restore();
  t.end();
});

```

## Creating spies: `sinon.spy()` Method Signatures

## Spy API

Check out the [full list of methods and properties](/concepts/spies/api/).

Spies provide a rich interface to inspect their usage. The above examples showed
the `calledOnce` boolean property as well as the `getCall` method and the
returned object's `args` property. There are three ways of inspecting [call][call] data.

The preferred approach is to use the spy's `calledWith` method (and friends)
because it keeps your test from being too specific about which call did what and
so on. It will return `true` if the spy was ever called with the provided
arguments.

If you want to be specific, you can directly check the first argument of the
first [call][call]. There are two ways of achieving this:

The first example uses the two-dimensional `args` array directly on the spy,
while the second example fetches the first [call][call] object and then accesses its
`args` array. Which one to use is a matter of preference, but the recommended
approach is going with `spy.calledWith(arg1, arg2, ...)` unless there's a need
to make the tests highly specific.

[call]: /concepts/spy-call/

[fakes]: /concepts/fakes/
