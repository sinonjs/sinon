---
layout: page
title: Fakes - Sinon.JS
breadcrumb: fakes
---

### Introduction

Fakes are a new concept to Sinon, simplifying and merging the concepts from `spies` and `stubs`.

A test fake is a `Function` that records arguments, return value, the value of
`this` and exception thrown (if any) for all its calls.

Fakes can be created with or without behaviour.

All fakes are immutable: once created, their behaviour will not change.

Unlike `sinon.spy` and `sinon.stub` APIs, the `sinon.fake` API knows only how to create fakes, and doesn't concern itself with plugging them into the system under test. To plug the fakes into the system under test, you can use the [`sinon.replace*`](../sandbox#replace) methods.


### Creating a fake

```js
// create a basic fake, with no behaviour
var fake = sinon.fake();

fake();

console.log(fake.callCount);
// 1
```

### Fakes with behaviour

Fakes can be created with behaviour, which cannot be changed once the fake has been created.

#### `sinon.fake.returns(value);`

Creates a fake that returns the `value` argument

```js
var fake = sinon.fake.returns('apple pie');

fake();
// apple pie
```

#### `sinon.fake.throws(value);`

Creates a fake that throws an `Error` with the provided value as the `message` property.

If an `Error` is passed as the `value` argument, then that will be the thrown value. If any other value is passed, then that will be used for the `message` property of the thrown `Error`.

```js
var fake = sinon.fake.throws(new Error('not apple pie'));

fake();
// Error: not apple pie
```

#### `sinon.fakes.resolves(value);`

Creates a fake that returns a resolved `Promise` for the passed value.

#### `sinon.fakes.rejects(value);`

Creates a fake that returns a rejected `Promise` for the passed value.

If an `Error` is passed as the `value` argument, then that will be the value of the promise. If any other value is passed, then that will be used for the `message` property of the `Error` returned by the promise.

#### `sinon.fake.yields(callback[, value1, ..., valueN]);`

Creates a fake that calls the provided callback with the provided values.

```js
var fake = sinon.fake.yields(console.log, 'hello world');

fake();
// hello world
```

#### `sinon.fake.yieldsAsync(callback[, value1, ..., valueN]);`

Creates a fake that calls the provided callback asynchronously with the provided values.

```js
var fake = sinon.fake.yieldsAsync(console.log, 'hello world');

fake();
// hello world
```


### `sinon.fake(func);`

Wraps an existing `Function` to record all interactions, while leaving it up to the `func` to provide the behaviour.

This is useful when complex behaviour not covered by the `sinon.fake.*` methods is required or when wrapping an existing function or method.


### Adding the fake to the system under test

Unlike `sinon.spy` and `sinon.stub`, `sinon.fake` only knows about creating fakes, not about replacing properties in the system under test.

To replace a property, you can use the `sinon.replace` method.

```js
var fake = sinon.fake.returns('42');

sinon.replace(console, 'log', fake);

console.log('apple pie');
// 42
```

When you want to restore the replaced properties, simply call the `sinon.restore` method.

```js
// restores all replaced properties set by sinon methods (restore, spy, stub)
sinon.restore();
```
