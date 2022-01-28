---
layout: page
title: Fakes - Sinon.JS
breadcrumb: fakes
examples:
  - fakes-1-using-fakes-instead-of-spies
  - fakes-2-using-fakes-instead-of-stubs
  - fakes-3-creating-without-behaviour
  - fakes-4-creating-with-custom-behaviour
  - fakes-5-returns
  - fakes-6-throws
  - fakes-7-yields
  - fakes-8-yields-async
  - fakes-9-callback
  - fakes-10-firstArg
  - fakes-11-lastArg
  - fakes-12-adding-fake-to-system-under-test
---

### Introduction

`fake` is available in Sinon from v5 onwards. It allows creation of a `fake` `Function` with the ability to set a default [behavior](#fakes-with-behavior). The available [behaviors](#fakes-with-behavior) for the most part match the API of a [`sinon.stub`][stubs].

In Sinon, a `fake` is a `Function` that records arguments, return value, the value of `this` and exception thrown (if any) for all of its calls.

A fake is immutable: once created, the behavior will not change.

Unlike [`sinon.spy`][spies] and [`sinon.stub`][stubs] methods, the `sinon.fake` API knows only how to create fakes, and doesn't concern itself with plugging them into the system under test. To plug the fakes into the system under test, you can use the [`sinon.replace*`](../sandbox#sandboxreplaceobject-property-replacement) methods.

### When to use fakes?

Fakes are alternatives to the Stubs and Spies, and they can fully replace all such use cases.

They are intended to be simpler to use, and avoids many bugs by having immutable behaviour.

The created `fake` `Function`, with or without behavior has the same API as a (`sinon.spy`)[spies].

#### Using fakes instead of spies

<div data-example-id="fakes-1-using-fakes-instead-of-spies"></div>

#### Using fakes instead of stubs

<div data-example-id="fakes-2-using-fakes-instead-of-stubs"></div>

### Creating a fake

Create a `fake` `Function` with or without [behavior](#fakes-with-behavior). The created `Function` has the same API as a [`sinon.spy`][spies].

#### Creating a fake without behavior

<div data-example-id="fakes-3-creating-without-behaviour"></div>

#### Creating a fake with custom behaviour

<div data-example-id="fakes-4-creating-with-custom-behaviour"></div>

### Fakes with behavior

Fakes cannot change once created with behaviour.

#### `sinon.fake.returns(value);`

Creates a fake that returns the `value` argument.

<div data-example-id="fakes-5-returns"></div>

#### `sinon.fake.throws(value);`

Creates a fake that throws an `Error` with the provided value as the `message` property.

If an `Error` is passed as the `value` argument, then that will be the thrown value. If any other value is passed, then that will be used for the `message` property of the thrown `Error`.

<div data-example-id="fakes-6-throws"></div>

#### `sinon.fake.resolves(value);`

Creates a fake that returns a resolved `Promise` for the passed value.

#### `sinon.fake.rejects(value);`

Creates a fake that returns a rejected `Promise` for the passed value.

If an `Error` is passed as the `value` argument, then that will be the value of the promise. If any other value is passed, then that will be used for the `message` property of the `Error` returned by the promise.

#### `sinon.fake.yields([value1, ..., valueN]);`

`sinon.fake.yields` takes some values, and returns a function that when being called, expects the last argument to be a callback and invokes that callback with the same previously given values. The returned function is normally used to fake a service function that takes a callback as the last argument.

In code example below, the '[readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)' function of the 'fs' module is replaced with a fake function created by `sinon.fake.yields`. When the fake function is called, it always calls the last argument it received, which is expected to be a callback, with the values that the `yields` function previously took.

<div data-example-id="fakes-7-yields"></div>

#### `sinon.fake.yieldsAsync([value1, ..., valueN]);`

Similar to `yields`, `yieldsAsync` also returns a function that when invoked, the function expects the last argument to be a callback and invokes that callback with the same previously given values. However, the returned function invokes that callback asynchronously rather than immediately, i.e. in the next event loop.

Compare the code example below with the code example above for `yields` to see the difference.

<div data-example-id="fakes-8-yields-async"></div>

#### `sinon.fake(func);`

Wraps an existing `Function` to record all interactions, while leaving it up to the `func` to provide the behavior.

The created `fake` `Function` has the same API as a [`sinon.spy`][spies].

This is useful when complex behavior not covered by the `sinon.fake.*` methods is required or when wrapping an existing function or method.

### Instance properties

The instance properties are the same as those of a [`sinon.spy`][spies]. The following examples showcase just a few of the properties available to you. Refer to the [spy docs][spies] for a complete list.

#### `f.callback`

This property is a convenience to get a reference to the last callback passed in the last to the fake.
The same convenience has been added to [spy calls](../spy-call#spycallcallback).

<div data-example-id="fakes-9-callback"></div>

#### `f.firstArg`

This property is a convenient way to get a reference to the first argument passed in the last call to the fake.
The same convenience has been added to [spy calls](../spy-call#spycallfirstarg).

<div data-example-id="fakes-10-firstArg"></div>

#### `f.lastArg`

This property is a convenient way to get a reference to the last argument passed in the last call to the fake.
The same convenience has been added to [spy calls](../spy-call#spycalllastarg).

<div data-example-id="fakes-11-lastArg"></div>

### Adding the fake to the system under test

Unlike `sinon.spy` and `sinon.stub`, `sinon.fake` only knows about creating fakes, not about replacing properties in the system under test.

To replace a property, you can use the [`sinon.replace`](../sandbox/#sandboxreplaceobject-property-replacement) method.
When you want to restore the replaced properties, call the `sinon.restore` method.

<div data-example-id="fakes-12-adding-fake-to-system-under-test"></div>

[spies]: ../spies
[stubs]: ../stubs
