---
layout: page
title: Stubs - Sinon.JS
breadcrumb: stubs
examples:
  - stubs-1-pubsub
  - stubs-2-different-args
  - stubs-3-sequential-interactions
  - stubs-4-sequential-with-args
  - stubs-5-reset-behaviour
  - stubs-6-reset-history
  - stubs-7-call-fake
  - stubs-8-call-through
  - stubs-9-call-through-with-new
  - stubs-10-use-promise-library
  - stubs-12-yield-to
  - stubs-14-add-behavior
  - stubs-15-replace-getter
  - stubs-16-define-new-setter
  - stubs-17-define-new-value
  - stubs-18-restore-values
---

### What are stubs?

Test stubs are functions (spies) with pre-programmed behavior.

They support the full [test spy API](../spies) in addition to methods which can be used to alter the stub's behavior.

As spies, stubs can be either anonymous, or wrap existing functions. When
wrapping an existing function with a stub, the original function is not called.

### When to use stubs?

Use a stub when you want to:

1. Control a method's behavior from a test to force the code down a specific path. Examples include forcing a method to throw an error in order to test error handling.

2. When you want to prevent a specific method from being called directly (possibly because it triggers undesired behavior, such as a `XMLHttpRequest` or similar).

The following example is yet another test from [PubSubJS][pubsubjs] which shows how to create an anonymous stub that throws an exception when called.

<div data-example-id="stubs-1-pubsub"></div>

Note how the stub also implements the spy interface. The test verifies that all
callbacks were called, and also that the exception throwing stub was called
before one of the other callbacks.

### Defining stub behavior on consecutive calls

Calling behavior defining methods like `returns` or `throws` multiple times
overrides the behavior of the stub. As of Sinon version 1.8, you can use the
[`onCall`](#stuboncalln-added-in-v18) method to make a stub respond differently on
consecutive calls.

Note that in Sinon version 1.5 to version 1.7, multiple calls to the `yields*`
and `callsArg*` family of methods define a sequence of behaviors for consecutive
calls. As of 1.8, this functionality has been removed in favor of the
[`onCall`](#stuboncalln-added-in-v18) API.

[pubsubjs]: https://github.com/mroderick/pubsubjs

### Stub API

### Properties

#### `var stub = sinon.stub();`

Creates an anonymous stub function

#### `var stub = sinon.stub(object, "method");`

Replaces `object.method` with a stub function. An exception is thrown if the property is not already a function.

The original function can be restored by calling `object.method.restore();` (or `stub.restore();`).

#### ~~`var stub = sinon.stub(object, "method", func);`~~

This has been removed from `v3.0.0`. Instead you should use

`stub(obj, 'meth').callsFake(fn)`

A [codemod is available](https://github.com/hurrymaplelad/sinon-codemod) to upgrade your code

#### `var stub = sinon.stub(obj);`

Stubs all the object's methods.

Note that it's usually better practice to stub individual methods, particularly on objects that you don't understand or control all the methods for (e.g. library dependencies).

Stubbing individual methods tests intent more precisely and is less susceptible to unexpected behavior as the object's code evolves.

If you want to create a stub object of `MyConstructor`, but don't want the constructor to be invoked, use this utility function.

```javascript
var stub = sinon.createStubInstance(MyConstructor, overrides);
```

`overrides` is an optional map overriding created stubs, for example:

```javascript
var stub = sinon.createStubInstance(MyConstructor, {
  foo: sinon.stub().returnsThis(),
});
```

is the same as:

```javascript
var stub = sinon.createStubInstance(MyConstructor);
stub.foo.returnsThis();
```

If provided value is not a stub, it will be used as the returned value:

```javascript
var stub = sinon.createStubInstance(MyConstructor, {
  foo: 3,
});
```

is the same as:

```javascript
var stub = sinon.createStubInstance(MyConstructor);
stub.foo.returns(3);
```

#### `stub.withArgs(arg1[, arg2, ...]);`

Stubs the method only for the provided arguments.

This is useful to be more expressive in your assertions, where you can access the spy with the same call. It is also useful to create a stub that can act differently in response to different arguments.

<div data-example-id="stubs-2-different-args"></div>

#### `stub.onCall(n);` _Added in v1.8_

Defines the behavior of the stub on the _nth_ call. Useful for testing sequential interactions.

<div data-example-id="stubs-3-sequential-interactions"></div>

There are methods `onFirstCall`, `onSecondCall`,`onThirdCall` to make stub definitions read more naturally.

`onCall` can be combined with all of the behavior defining methods in this section. In particular, it can be used together with `withArgs`.

<div data-example-id="stubs-4-sequential-with-args"></div>

Note how the behavior of the stub for argument `42` falls back to the default behavior once no more calls have been defined.

#### `stub.onFirstCall();`

Alias for `stub.onCall(0);`

#### `stub.onSecondCall();`

Alias for `stub.onCall(1);`

#### `stub.onThirdCall();`

Alias for `stub.onCall(2);`

#### `stub.reset();`

Resets both behaviour and history of the stub.

This is equivalent to calling both `stub.resetBehavior()` and `stub.resetHistory()`

_Updated in `sinon@2.0.0`_

_Since `sinon@5.0.0`_

As a convenience, you can apply `stub.reset()` to all stubs using `sinon.reset()`

#### `stub.resetBehavior();`

Resets the stub's behaviour to the default behaviour

<div data-example-id="stubs-5-reset-behaviour"></div>

_Since `sinon@5.0.0`_

You can reset behaviour of all stubs using `sinon.resetBehavior()`

#### `stub.resetHistory();`

_Since `sinon@2.0.0`_

Resets the stub's history

<div data-example-id="stubs-6-reset-history"></div>

_Since `sinon@5.0.0`_

You can reset history of all stubs using `sinon.resetHistory()`

#### `stub.callsFake(fakeFunction);`

Makes the stub call the provided `fakeFunction` when invoked.

<div data-example-id="stubs-7-call-fake"></div>

#### `stub.returns(obj);`

Makes the stub return the provided value.

#### `stub.returnsArg(index);`

Causes the stub to return the argument at the provided index.

`stub.returnsArg(0);` causes the stub to return the first argument.

If the argument at the provided index is not available, prior to `sinon@6.1.2`,
an `undefined` value will be returned; starting from `sinon@6.1.2`, a `TypeError`
will be thrown.

#### `stub.returnsThis();`

Causes the stub to return its <code>this</code> value.

Useful for stubbing jQuery-style fluent APIs.

#### `stub.resolves(value);`

Causes the stub to return a Promise which resolves to the provided value.

When constructing the Promise, sinon uses the `Promise.resolve` method. You are
responsible for providing a polyfill in environments which do not provide `Promise`.
The Promise library can be overwritten using the `usingPromise` method.

_Since `sinon@2.0.0`_

#### `stub.resolvesArg(index);`

Causes the stub to return a Promise which resolves to the argument at the
provided index.

`stub.resolvesArg(0);` causes the stub to return a Promise which resolves to the
first argument.

If the argument at the provided index is not available, a `TypeError` will be
thrown.

_Since `sinon@6.1.1`_

#### `stub.throws();`

Causes the stub to throw an exception (`Error`).

#### `stub.throws("name"[, "optional message"]);`

Causes the stub to throw an exception with the `name` property set to the provided string. The message parameter is optional and will set the `message` property of the exception.

#### `stub.throws(obj);`

Causes the stub to throw the provided exception object.

#### `stub.throws(function() { return new Error(); });`

Causes the stub to throw the exception returned by the function.

#### `stub.throwsArg(index);`

Causes the stub to throw the argument at the provided index.

`stub.throwsArg(0);` causes the stub to throw the first argument as the
exception.

If the argument at the provided index is not available, a `TypeError` will be
thrown.

_Since `sinon@2.3.0`_

#### `stub.rejects();`

Causes the stub to return a Promise which rejects with an exception (`Error`).

When constructing the Promise, sinon uses the `Promise.reject` method. You are
responsible for providing a polyfill in environments which do not provide `Promise`.
The Promise library can be overwritten using the `usingPromise` method.

_Since `sinon@2.0.0`_

#### `stub.rejects("TypeError");`

Causes the stub to return a Promise which rejects with an exception of the provided type.

_Since `sinon@2.0.0`_

#### `stub.rejects(value);`

Causes the stub to return a Promise which rejects with the provided exception object.

_Since `sinon@2.0.0`_

#### `stub.callsArg(index);`

Causes the stub to call the argument at the provided index as a callback function.

`stub.callsArg(0);` causes the stub to call the first argument as a callback.

If the argument at the provided index is not available or is not a function,
a `TypeError` will be thrown.

#### `stub.callThrough();`

Causes the original method wrapped into the stub to be called when none of the conditional stubs are matched.

<div data-example-id="stubs-8-call-through"></div>

#### `stub.callThroughWithNew();`

Causes the original method wrapped into the stub to be called using the `new` operator when none of the conditional stubs are matched.

<div data-example-id="stubs-9-call-through-with-new"></div>

#### `stub.callsArgOn(index, context);`

Like `stub.callsArg(index);` but with an additional parameter to pass the `this` context.

#### `stub.callsArgWith(index, arg1, arg2, ...);`

Like `callsArg`, but with arguments to pass to the callback.

#### `stub.callsArgOnWith(index, context, arg1, arg2, ...);`

Like above but with an additional parameter to pass the `this` context.

#### `stub.usingPromise(promiseLibrary);`

Causes the stub to return promises using a specific Promise library instead of
the global one when using `stub.rejects` or `stub.resolves`. Returns the stub
to allow chaining.

<div data-example-id="stubs-10-use-promise-library"></div>

_Since `sinon@2.0.0`_

#### `stub.yields([arg1, arg2, ...])`

Similar to `callsArg`.

Causes the stub to call the first callback it receives with the provided arguments (if any).

If a method accepts more than one callback, you need to use `yieldsRight` to call the last callback or `callsArg` to have the stub invoke other callbacks than the first or last one.

#### `stub.yieldsRight([arg1, arg2, ...])`

Like `yields` but calls the last callback it receives.

#### `stub.yieldsOn(context, [arg1, arg2, ...])`

Like `yields` but with an additional parameter to pass the `this` context.

#### `stub.yieldsTo(property, [arg1, arg2, ...])`

Causes the spy to invoke a callback passed as a property of an object to the spy.

Like `yields`, `yieldsTo` grabs the first matching argument, finds the callback and calls it with the (optional) arguments.

```javascript
"test should fake successful ajax request": function () {
    sinon.stub(jQuery, "ajax").yieldsTo("success", [1, 2, 3]);

    jQuery.ajax({
        success: function (data) {
            assertEquals([1, 2, 3], data);
        }
    });
}
```

#### `stub.yieldsToOn(property, context, [arg1, arg2, ...])`

Like above but with an additional parameter to pass the `this` context.

#### `stub.yield([arg1, arg2, ...])`

Invoke callbacks passed to the `stub` with the given arguments.

If the stub was never called with a function argument, `yield` throws an error.

Returns an Array with all callbacks return values in the order they were called, if no error is thrown.

Also aliased as `invokeCallback`.

#### `stub.yieldTo(callback, [arg1, arg2, ...])`

Invokes callbacks passed as a property of an object to the stub.

Like `yield`, `yieldTo` grabs the first matching argument, finds the callback and calls it with the (optional) arguments.

<div data-example-id="stubs-12-yield-to"></div>

#### `stub.callArg(argNum)`

Like `yield`, but with an explicit argument number specifying which callback to call.

Useful if a function is called with more than one callback, and calling the first callback is not desired.

```javascript
"calling the last callback": function () {
    var callback = sinon.stub();
    callback(function () {
        console.log("Success!");
    }, function () {
        console.log("Oh noes!");
    });

    callback.callArg(1); // Logs "Oh noes!"
}
```

#### `stub.callArgWith(argNum, [arg1, arg2, ...])`

Like `callArg`, but with arguments.

#### Asynchronous calls

Same as their corresponding non-Async counterparts, but with callback being deferred at called after all instructions in the current call stack are processed.

- In Node environment the callback is deferred with `process.nextTick`.
- In a browser the callback is deferred with `setTimeout(callback, 0)`.

More information:

- <https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick>,
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop>,
- <https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout>.

##### `stub.callsArgAsync(index);`

Async version of [stub.callsArg(index)](#stubcallsargindex). See also [Asynchronous calls](#asynchronous-calls).

##### `stub.callsArgOnAsync(index, context);`

Async version of [stub.callsArgOn(index, context)](#stubcallsargonindex-context). See also [Asynchronous calls](#asynchronous-calls).

##### `stub.callsArgWithAsync(index, arg1, arg2, ...);`

Async version of [stub.callsArgWith(index, arg1, arg2, ...)](#stubcallsargwithindex-arg1-arg2-). See also [Asynchronous calls](#asynchronous-calls).

##### `stub.callsArgOnWithAsync(index, context, arg1, arg2, ...);`

Async version of [stub.callsArgOnWith(index, context, arg1, arg2, ...)](#stubcallsargonwithindex-context-arg1-arg2-). See also [Asynchronous calls](#asynchronous-calls).

##### `stub.yieldsAsync([arg1, arg2, ...]);`

Async version of [stub.yields([arg1, arg2, ...])](#stubyieldsarg1-arg2-). See also [Asynchronous calls](#asynchronous-calls).

##### `stub.yieldsOnAsync(context, [arg1, arg2, ...]);`

Async version of [stub.yieldsOn(context, [arg1, arg2, ...])](#stubyieldsoncontext-arg1-arg2-). See also [Asynchronous calls](#asynchronous-calls).

##### `stub.yieldsToAsync(property, [arg1, arg2, ...]);`

Async version of [stub.yieldsTo(property, [arg1, arg2, ...])](#stubyieldstoproperty-arg1-arg2-). See also [Asynchronous calls](#asynchronous-calls).

##### `stub.yieldsToOnAsync(property, context, [arg1, arg2, ...])`

Async version of [stub.yieldsToOn(property, context, [arg1, arg2, ...])](#stubyieldstoonproperty-context-arg1-arg2-). See also [Asynchronous calls](#asynchronous-calls).

#### `sinon.addBehavior(name, fn);`

Add a custom behavior. The name will be available as a function on stubs, and the chaining mechanism will be set up for you (e.g. no need to return anything from your function, its return value will be ignored). The `fn` will be passed the fake instance as its first argument, and then the user's arguments.

<div data-example-id="stubs-14-add-behavior"></div>

#### `stub.get(getterFn)`

Replaces a new getter for this stub.

<div data-example-id="stubs-15-replace-getter"></div>

#### `stub.set(setterFn)`

Defines a new setter for this stub.

<div data-example-id="stubs-16-define-new-setter"></div>

#### `stub.value(newVal)`

Defines a new value for this stub.

<div data-example-id="stubs-17-define-new-value"></div>

You can restore values by calling the `restore` method:

<div data-example-id="stubs-18-restore-values"></div>

#### `stub.wrappedMethod`

Holds a reference to the original method/function this stub has
wrapped. `undefined` for the property accessors.
