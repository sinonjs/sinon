---
layout: page
title: Fakes - Sinon.JS
breadcrumb: fakes
---

### Introduction

`fake` is available in Sinon from v5 onwards. It allows creation of a `fake` `Function` with the ability to set a default [behavior](#fakes-with-behavior). Set the [behavior](#fakes-with-behavior) using `Functions` with the same API as those in a [`sinon.stub`][stubs]. The created `fake` `Function`, with or without behavior has the same API as a (`sinon.spy`)[spies].

In Sinon, a `fake` is a `Function` that records arguments, return value, the value of `this` and exception thrown (if any) for all of its calls.

A fake is immutable: once created, the behavior will not change.

Unlike [`sinon.spy`][spies] and [`sinon.stub`][stubs] methods, the `sinon.fake` API knows only how to create fakes, and doesn't concern itself with plugging them into the system under test. To plug the fakes into the system under test, you can use the [`sinon.replace*`](../sandbox#sandboxreplaceobject-property-replacement) methods.

### Creating a fake

Create a `fake` `Function` with or without [behavior](#fakes-with-behavior). The created `Function` has the same API as a [`sinon.spy`][spies].

#### Creating a fake without behavior

```js
// create a basic fake, with no behavior
var fake = sinon.fake();

fake();
// undefined

fake.callCount;
// 1
```

#### Creating a fake with custom behaviour

```js
// create a fake that returns the text "foo"
var fake = sinon.fake.returns('foo');

fake()
// foo
```

### Fakes with behavior

Fakes cannot change once created with behaviour.

#### `sinon.fake.returns(value);`

Creates a fake that returns the `value` argument.


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

#### `sinon.fake.resolves(value);`

Creates a fake that returns a resolved `Promise` for the passed value.


#### `sinon.fake.rejects(value);`

Creates a fake that returns a rejected `Promise` for the passed value.


If an `Error` is passed as the `value` argument, then that will be the value of the promise. If any other value is passed, then that will be used for the `message` property of the `Error` returned by the promise.

#### `sinon.fake.yields([value1, ..., valueN]);`

`sinon.fake.yields` takes some values, and returns a function that when being called, expects the last argument to be a callback and invokes that callback with the same previously given values. The returned function is normally used to fake a service function that takes a callback as the last argument.


 In code example below, the '[readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)' function of the 'fs' module is replaced with a fake function created by `sinon.fake.yields`. When the fake function is called, it always calls the last argument it received, which is expected to be a callback, with the values that the `yields` function previously took.

```js
var fake = sinon.fake.yields(null, 'file content');
sinon.replace(fs, 'readFile', fake);
fs.readFile('somefile',(err,data)=>{console.log(data);});
console.log('end of this event loop');
// file content
// end of this event loop
```
#### `sinon.fake.yieldsAsync([value1, ..., valueN]);`

Similar to `yields`, `yieldsAsync` also returns a function that when invoked, the function expects the last argument to be a callback and invokes that callback with the same previously given values. However, the returned function invokes that callback asynchronously rather than immediately, i.e. in the next event loop.


Compare the output of the code example below with the output of the code example above for `yields` to see the difference.

```js
var fakeAsync = sinon.fake.yieldsAsync(null, 'file content');
sinon.replace(fs, 'readFile', fakeAsync);
fs.readFile('somefile',(err,data)=>{console.log(data);});
console.log('end of this event loop');
// end of this event loop
// file content
```

#### `sinon.fake(func);`

Wraps an existing `Function` to record all interactions, while leaving it up to the `func` to provide the behavior.

The created `fake` `Function` has the same API as a [`sinon.spy`][spies].

This is useful when complex behavior not covered by the `sinon.fake.*` methods is required or when wrapping an existing function or method.

### Instance properties

The instance properties are the same as a [`sinon.spy`][spies].

#### `f.callback`

This property is a convenience to get a reference to the last callback passed in the last to the fake.

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

#### `f.firstArg`

This property is a convenient way to get a reference to the first argument passed in the last call to the fake.

```js
var f = sinon.fake();
var date1 = new Date();
var date2 = new Date();

f(date1, 1, 2);
f(date2, 1, 2);

f.firstArg === date2;
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

When you want to restore the replaced properties, call the `sinon.restore` method.

```js
// restores all replaced properties set by sinon methods (replace, spy, stub)
sinon.restore();
```

[spies]: ../spies
[stubs]: ../stubs
