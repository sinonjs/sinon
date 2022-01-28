---
layout: page
title: Stubs - Sinon.JS
breadcrumb: stubs
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

```javascript
"test should call all subscribers, even if there are exceptions" : function(){
    var message = 'an example message';
    var stub = sinon.stub().throws();
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();

    PubSub.subscribe(message, stub);
    PubSub.subscribe(message, spy1);
    PubSub.subscribe(message, spy2);

    PubSub.publishSync(message, undefined);

    assert(spy1.called);
    assert(spy2.called);
    assert(stub.calledBefore(spy1));
}
```

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

If you need to stub getters/setters or non-function properties, then you should be using [`sandbox.stub`](../sandbox/#sandboxstub)

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
var stub = sinon.createStubInstance(MyConstructor)
```

#### `stub.withArgs(arg1[, arg2, ...]);`

Stubs the method only for the provided arguments.

This is useful to be more expressive in your assertions, where you can access the spy with the same call. It is also useful to create a stub that can act differently in response to different arguments.

```javascript
"test should stub method differently based on arguments": function () {
    var callback = sinon.stub();
    callback.withArgs(42).returns(1);
    callback.withArgs(1).throws("name");

    callback(); // No return value, no exception
    callback(42); // Returns 1
    callback(1); // Throws Error("name")
}
```

#### `stub.onCall(n);` *Added in v1.8*

Defines the behavior of the stub on the *nth* call. Useful for testing sequential interactions.

```javascript
"test should stub method differently on consecutive calls": function () {
    var callback = sinon.stub();
    callback.onCall(0).returns(1);
    callback.onCall(1).returns(2);
    callback.returns(3);

    callback(); // Returns 1
    callback(); // Returns 2
    callback(); // All following calls return 3
}
```

There are methods `onFirstCall`, `onSecondCall`,`onThirdCall` to make stub definitions read more naturally.

`onCall` can be combined with all of the behavior defining methods in this section.  In particular, it can be used together with `withArgs`.

```javascript
"test should stub method differently on consecutive calls with certain argument": function () {
    var callback = sinon.stub();
    callback.withArgs(42)
        .onFirstCall().returns(1)
        .onSecondCall().returns(2);
    callback.returns(0);

    callback(1); // Returns 0
    callback(42); // Returns 1
    callback(1); // Returns 0
    callback(42); // Returns 2
    callback(1); // Returns 0
    callback(42); // Returns 0
}
```

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

*Updated in `sinon@2.0.0`*

#### `stub.resetBehavior();`

Resets the stub's behaviour to the default behaviour

```javascript
var stub = sinon.stub();

stub.returns(54)

stub(); // 54

stub.resetBehavior();

stub(); // undefined
```


#### `stub.resetHistory();`

Resets the stub's history

```javascript
var stub = sinon.stub();

stub.called // false

stub();

stub.called // true

stub.resetHistory();

stub.called // false
```

*Since `sinon@2.0.0`*

#### `stub.callsFake(fakeFunction);`
Makes the stub call the provided `fakeFunction` when invoked.

```javascript
var myObj = {};
myObj.prop = function propFn() {
    return 'foo';
};

sinon.stub(myObj, 'prop').callsFake(function fakeFn() {
    return 'bar';
});

myObj.prop(); // 'bar'
```

#### `stub.returns(obj);`
Makes the stub return the provided value.

#### `stub.returnsArg(index);`

Causes the stub to return the argument at the provided index.

`stub.returnsArg(0);` causes the stub to return the first argument.


#### `stub.returnsThis();`
Causes the stub to return its <code>this</code> value.

Useful for stubbing jQuery-style fluent APIs.

#### `stub.resolves(value);`

Causes the stub to return a Promise which resolves to the provided value.

When constructing the Promise, sinon uses the `Promise.resolve` method. You are
responsible for providing a polyfill in environments which do not provide `Promise`.
The Promise library can be overwritten using the `usingPromise` method.

*Since `sinon@2.0.0`*

#### `stub.throws();`

Causes the stub to throw an exception (`Error`).


#### `stub.throws("name"[, "optional message"]);`

Causes the stub to throw an exception with the `name` property set to the provided string. The message parameter is optional and will set the `message` property of the exception.


#### `stub.throws(obj);`

Causes the stub to throw the provided exception object.


#### `stub.throws(function() { return new Error(); });`

Causes the stub to throw the exception returned by the function.


#### `stub.rejects();`

Causes the stub to return a Promise which rejects with an exception (`Error`).

When constructing the Promise, sinon uses the `Promise.reject` method. You are
responsible for providing a polyfill in environments which do not provide `Promise`.
The Promise library can be overwritten using the `usingPromise` method.

*Since `sinon@2.0.0`*


#### `stub.rejects("TypeError");`

Causes the stub to return a Promise which rejects with an exception of the provided type.

*Since `sinon@2.0.0`*


#### `stub.rejects(value);`

Causes the stub to return a Promise which rejects with the provided exception object.

*Since `sinon@2.0.0`*


#### `stub.callsArg(index);`

Causes the stub to call the argument at the provided index as a callback function. `stub.callsArg(0);` causes the stub to call the first argument as a callback.


#### `stub.callThrough();`

Causes the original method wrapped into the stub to be called when none of the conditional stubs are matched.

```javascript
var stub = sinon.stub();

var obj = {};

obj.sum = function sum(a, b) {
    return a + b;
};

stub(obj, 'sum');

obj.sum.withArgs(2, 2).callsFake(function foo() {
    return 'bar';
});

obj.sum.callThrough();

obj.sum(2, 2); // 'bar'
obj.sum(1, 2); // 3
```


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

```javascript
var myObj = {
    saveSomething: sinon.stub().usingPromise(bluebird.Promise).resolves("baz");
}

myObj.saveSomething()
    .tap(function(actual) {
        console.log(actual); // baz
    });
```

*Since `sinon@2.0.0`*

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


#### `stub.yieldsToOn(property, context, [arg1, arg2, ...])`

Like above but with an additional parameter to pass the `this` context.

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


#### `stub.yield([arg1, arg2, ...])`

Invoke callbacks passed to the `stub` with the given arguments.

If the stub was never called with a function argument, `yield` throws an error.

Also aliased as `invokeCallback`.


#### `stub.yieldTo(callback, [arg1, arg2, ...])`

Invokes callbacks passed as a property of an object to the stub.

Like `yield`, `yieldTo` grabs the first matching argument, finds the callback and calls it with the (optional) arguments.

```javascript
"calling callbacks": function () {
    var callback = sinon.stub();
    callback({
        "success": function () {
            console.log("Success!");
        },
        "failure": function () {
            console.log("Oh noes!");
        }
    });

    callback.yieldTo("failure"); // Logs "Oh noes!"
}
```


#### `stub.callArg(argNum)`

Like `yield`, but with an explicit argument number specifying which callback to call.

Useful if a function is called with more than one callback, and simply calling the first callback is not desired.

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


#### `stub.callsArgAsync(index);`

Same as their corresponding non-Async counterparts, but with callback being deferred (executed not immediately but after short timeout and in another "thread")

#### `stub.callsArgAsync(index);`

#### `stub.callsArgOnAsync(index, context);`

#### `stub.callsArgWithAsync(index, arg1, arg2, ...);`

#### `stub.callsArgOnWithAsync(index, context, arg1, arg2, ...);`

#### `stub.yieldsAsync([arg1, arg2, ...]);`

#### `stub.yieldsOnAsync(context, [arg1, arg2, ...]);`

#### `stub.yieldsToAsync(property, [arg1, arg2, ...]);`

#### `stub.yieldsToOnAsync(property, context, [arg1, arg2, ...])`

Same as their corresponding non-Async counterparts, but with callback being deferred (executed not immediately but after short timeout and in another "thread")

#### `sinon.addBehavior(name, fn);`

Add a custom behavior. The name will be available as a function on stubs, and the chaining mechanism will be set up for you (e.g. no need to return anything from your function, its return value will be ignored). The `fn` will be passed the fake instance as its first argument, and then the user's arguments.

```javascript
const sinon = require('sinon');

sinon.addBehavior('returnsNum', (fake, n) => fake.returns(n));

var stub = sinon.stub().returnsNum(42);

assert.equals(stub(), 42);
```

#### `stub.get(getterFn)`

Replaces a new getter for this stub.

```javascript
var myObj = {
    prop: 'foo'
};

sinon.stub(myObj, 'prop').get(function getterFn() {
    return 'bar';
});

myObj.prop; // 'bar'
```

#### `stub.set(setterFn)`

Defines a new setter for this stub.

```javascript
var myObj = {
    example: 'oldValue',
    prop: 'foo'
};

sinon.stub(myObj, 'prop').set(function setterFn(val) {
    myObj.example = val;
});

myObj.prop = 'baz';

myObj.example; // 'baz'
```

#### `stub.value(newVal)`

Defines a new value for this stub.

```javascript
var myObj = {
    example: 'oldValue',
};

sinon.stub(myObj, 'example').value('newValue');

myObj.example; // 'newValue'
```

You can restore values by calling the `restore` method:

```javascript
var myObj = {
    example: 'oldValue',
};

var stub = sinon.stub(myObj, 'example').value('newValue');
stub.restore()

myObj.example; // 'oldValue'
```

