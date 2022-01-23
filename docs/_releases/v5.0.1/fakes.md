---
layout: page
title: Fakes - Sinon.JS
breadcrumb: fakes
---

### Introduction

`fake` was introduced with Sinon with v5. It simplifies and merges concepts from [`spies`][spies] and [`stubs`][stubs].

In Sinon, a `fake` is a `Function` that records arguments, return value, the value of `this` and exception thrown (if any) for all of its calls.

It can be created with or without behavior; it can wrap an existing function.

A fake is immutable: once created, the behavior will not change.

Unlike [`sinon.spy`][spies] and [`sinon.stub`][stubs] methods, the `sinon.fake` API knows only how to create fakes, and doesn't concern itself with plugging them into the system under test. To plug the fakes into the system under test, you can use the [`sinon.replace*`](../sandbox#sandboxreplaceobject-property-replacement) methods.


### Creating a fake

```js
// create a basic fake, with no behavior
var fake = sinon.fake();

fake();

console.log(fake.callCount);
// 1
```

### Fakes with behavior

Fakes can be created with behavior, which cannot be changed once the fake has been created.

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

`fake` expects the last argument to be a callback and will invoke it with the given arguments.

```js
var fake = sinon.fake.yields('hello world');

fake(console.log);
// hello world
```

#### `sinon.fake.yieldsAsync(callback[, value1, ..., valueN]);`

`fake` expects the last argument to be a callback and will invoke it asynchronously with the given arguments.

```js
var fake = sinon.fake.yieldsAsync('hello world');

fake(console.log);
// hello world
```

#### `sinon.fake(func);`

Wraps an existing `Function` to record all interactions, while leaving it up to the `func` to provide the behavior.

This is useful when complex behavior not covered by the `sinon.fake.*` methods is required or when wrapping an existing function or method.

### Instance properties

#### `f.callback`

This property is a convenience to easily get a reference to the last callback passed in the last to the fake.

```js
var f = sinon.fake();
var cb1 = function () {};
var cb2 = function () {};

f(1, 2, 3, cb1);
f(1, 2, 3, cb2);

f.callback === cb2;
// true
```

The same convenience has been added to [spy calls](../spy-call):

```js
f.getCall(1).callback === cb2;
// true
//
f.lastCall.callback === cb2;
// true
```

#### `f.lastArg`

This property is a convenient way to get a reference to the last argument passed in the last call to the fake.

```js
var f = sinon.fake();
var date1 = new Date();
var date2 = new Date();

f(1, 2, date1);
f(1, 2, date2);

f.lastArg === date2;
// true
```

The same convenience has been added to [spy calls](../spy-call):

```js
f.getCall(0).lastArg === date1;
// true
f.getCall(1).lastArg === date2;
// true

f.lastCall.lastArg === date2;
// true
```


### Adding the fake to the system under test

Unlike `sinon.spy` and `sinon.stub`, `sinon.fake` only knows about creating fakes, not about replacing properties in the system under test.

To replace a property, you can use the [`sinon.replace`](../sandbox/#sandboxreplaceobject-property-replacement) method.

```js
var fake = sinon.fake.returns('42');

sinon.replace(console, 'log', fake);

console.log('apple pie');
// 42
```

When you want to restore the replaced properties, simply call the `sinon.restore` method.

```js
// restores all replaced properties set by sinon methods (replace, spy, stub)
sinon.restore();
```

[spies]: ../spies
[stubs]: ../stubs
