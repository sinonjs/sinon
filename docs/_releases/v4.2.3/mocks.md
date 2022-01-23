---
layout: page
title: Mocks - Sinon.JS
breadcrumb: mocks
---

### Introduction

### What are mocks?

Mocks (and mock expectations) are fake methods (like spies) with pre-programmed behavior (like stubs) as well as **pre-programmed expectations**.

A mock will fail your test if it is not used as expected.


### When to use mocks?

Mocks should only be used for the *method under test*. In every unit test, there should be one unit under test.

If you want to control how your unit is being used and like stating expectations upfront (as opposed to asserting after the fact), use a mock.


### When to **not** use mocks?

Mocks come with built-in expectations that may fail your test.

Thus, they enforce implementation details. The rule of thumb is: if you wouldn't add an assertion for some specific call, don't mock it. Use a stub instead.

In general you should have **no more than one** mock (possibly with several expectations) in a single test.

[Expectations](#expectations) implement both the [spies](../spies) and [stubs](../stubs) APIs.

To see what mocks look like in Sinon.JS, here is one of the [PubSubJS][pubsubjs] tests again, this time using a method as callback and using mocks to verify its behavior

```javascript
"test should call all subscribers when exceptions": function () {
    var myAPI = { method: function () {} };

    var spy = sinon.spy();
    var mock = sinon.mock(myAPI);
    mock.expects("method").once().throws();

    PubSub.subscribe("message", myAPI.method);
    PubSub.subscribe("message", spy);
    PubSub.publishSync("message", undefined);

    mock.verify();
    assert(spy.calledOnce);
}
```

[pubsubjs]: https://github.com/mroderick/pubsubjs


## Mocks API

### Properties

#### `var mock = sinon.mock(obj);`

Creates a mock for the provided object.

Does not change the object, but returns a mock object to set expectations on the object's methods.


#### `var expectation = mock.expects("method");`

Overrides `obj.method` with a mock function and returns it.

See [expectations](#expectations) below.


#### `mock.restore();`

Restores all mocked methods.


#### `mock.verify();`

Verifies all expectations on the mock.

If any expectation is not satisfied, an exception is thrown.

Also restores the mocked methods.


### Expectations

All the expectation methods return the expectation, meaning you can chain them.

Typical usage:

```javascript
sinon.mock(jQuery).expects("ajax").atLeast(2).atMost(5);
jQuery.ajax.verify();
```


#### `var expectation = sinon.expectation.create([methodName]);`

Creates an expectation without a mock object, basically an anonymous mock function.

Method name is optional and is used in exception messages to make them more readable.


#### `var expectation = sinon.mock([methodName]);`

The same as the above.


#### `expectation.atLeast(number);`

Specify the minimum amount of calls expected.


#### `expectation.atMost(number);`

Specify the maximum amount of calls expected.


#### `expectation.never();`
Expect the method to never be called.


#### `expectation.once();`

Expect the method to be called exactly once.


#### `expectation.twice();`

Expect the method to be called exactly twice.


#### `expectation.thrice();`

Expect the method to be called exactly thrice.


#### `expectation.exactly(number);`

Expect the method to be called exactly `number` times.


#### `expectation.withArgs(arg1, arg2, ...);`

Expect the method to be called with the provided arguments and possibly others.

An `expectation` instance only holds onto a single set of arguments specified with `withArgs`. Subsequent calls will overwrite the previously-specified set of arguments (even if they are different), so it is generally not intended that this method be invoked more than once per test case.


#### `expectation.withExactArgs(arg1, arg2, ...);`

Expect the method to be called with the provided arguments and no others.

An `expectation` instance only holds onto a single set of arguments specified with `withExactArgs`. Subsequent calls will overwrite the previously-specified set of arguments (even if they are different), so it is generally not intended that this method be invoked more than once per test case.


#### `expectation.on(obj);`

Expect the method to be called with `obj` as `this`."}


#### `expectation.verify();`

Verifies the expectation and throws an exception if it's not met.
