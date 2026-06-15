---
title: Spies
description: Test spies that record arguments, return values, and exceptions for all calls. Wrap existing methods or create anonymous spies.
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

<<< @/.vitepress/tests/docs/spies/_index-1.test.js

## Using a spy to wrap all object method

`sinon.spy(object)`

Spies all the object's methods.

Note that it's usually better practice to spy individual methods, particularly on objects that you don't understand or control all the methods for (e.g. library dependencies).

Spying individual methods tests intent more precisely and is less susceptible to unexpected behavior as the object's code evolves.

The following is a slightly contrived example:

<<< @/.vitepress/tests/docs/spies/_index-2.test.js

## Using a spy to wrap an existing method

`sinon.spy(object, "method")` creates a spy that wraps the existing function
`object.method`. The spy will behave exactly like the original method
(including when used as a constructor), but you will have access to data about
all [calls][call]. The following is a slightly contrived example:

<<< @/.vitepress/tests/docs/spies/_index-3.test.js

## Using a spy to wrap property getter and setter

`sinon.spy(object, "property", ["get", "set"])` creates spies that wrap the
getters and setters for `object.property`. The spies will behave exactly like
the original getters and setters, but you will have access to data about all
[calls][call]. Example:

<<< @/.vitepress/tests/docs/spies/_index-4.test.js

## Creating spies: `sinon.spy()` Method Signatures

<dl>
  <dt><code>var spy = sinon.spy();</code></dt>
  <dd>
    Creates an anonymous function that records arguments, <code>this</code> value,
    exceptions and return values for all calls.
  </dd>
  <dt><code>var spy = sinon.spy(myFunc);</code></dt>
  <dd>
    Wraps the function in a spy. You can pass this spy where the original function would otherwise
    be passed when you need to verify how the function is being used.
  </dd>
  <dt><code>var spy = sinon.spy(object, "method");</code></dt>
  <dd>
    Creates a spy for <code>object.method</code> and
    replaces the original method with the spy. An exception is thrown if the property
    is not already a function. The spy acts exactly like the original method in
    all cases. The original method can be restored by calling
    <code>object.method.restore()</code>. The returned spy is the function
    object which replaced the original method. <code>spy === object.method</code>.
  </dd>
  <dt><code>var spy = sinon.spy(object, "property", types);</code></dt>
  <dd>
    Creates a spy for the property <code>object.property</code> which
    replaces the descriptor with an equivalent where each
    specified accessor (<code>types</code> parameter) has been
    wrapped as a spy. The returned object, unlike regular spies, is a
    property descriptor containing the wrapped accessors (spies).
    The original accessors can be restored by calling
    <code>spy.get.restore()</code> (where <code>get</code>
    is the accessor you wish to restore).
  </dd>
</dl>

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
