---
layout: page
title: Assertions - Sinon.JS
breadcrumb: assertions
---

Sinon.JS ships with a set of assertions that mirror most behavior verification methods and properties on spies and stubs. The advantage of using the assertions is that failed expectations on stubs and spies can be expressed directly as assertion failures with detailed and helpful error messages.

To make sure assertions integrate nicely with your test framework, you should customize either `sinon.assert.fail` or `sinon.assert.failException` and look into `sinon.assert.expose` and `sinon.assert.pass`.

The assertions can be used with either spies or stubs.

```javascript
"test should call subscribers with message as first argument" : function () {
    var message = "an example message";
    var spy = sinon.spy();

    PubSub.subscribe(message, spy);
    PubSub.publishSync(message, "some payload");

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, message);
}
```

## Assertions API

#### `sinon.assert.fail(message)`

Every assertion fails by calling this method.

By default it throws an error of type `sinon.assert.failException`.

If the test framework looks for assertion errors by checking for a specific exception, you can simply override the kind of exception thrown. If that does not fit with your testing framework of choice, override the `fail` method to do the right thing.


#### `sinon.assert.failException;`

Defaults to `AssertError`.


#### `sinon.assert.pass(assertion);`

Called every time `assertion` passes.

Default implementation does nothing.


#### `sinon.assert.notCalled(spy);`

Passes if `spy` was never called

#### `sinon.assert.called(spy);`

Passes if `spy` was called at least once.


#### `sinon.assert.calledOnce(spy);`

Passes if `spy` was called once and only once.


#### `sinon.assert.calledTwice(spy);`

Passes if `spy` was called exactly twice.


#### `sinon.assert.calledThrice(spy)`

Passes if `spy` was called exactly three times.


#### `sinon.assert.callCount(spy, num)`
Passes if `spy` was called exactly `num` times.


#### `sinon.assert.callOrder(spy1, spy2, ...)`
Passes if provided spies were called in the specified order.


#### `sinon.assert.calledOn(spyOrSpyCall, obj)`

Passes if `spy` was ever called with `obj` as its `this` value.

It's possible to assert on a dedicated spy call: `sinon.assert.calledOn(spy.firstCall, arg1, arg2, ...);`.


#### `sinon.assert.alwaysCalledOn(spy, obj)`

Passes if `spy` was always called with `obj` as its `this` value.


#### `sinon.assert.calledWith(spyOrSpyCall, arg1, arg2, ...);`

Passes if `spy` was called with the provided arguments.

It's possible to assert on a dedicated spy call: `sinon.assert.calledWith(spy.firstCall, arg1, arg2, ...);`.


#### `sinon.assert.alwaysCalledWith(spy, arg1, arg2, ...);`

Passes if `spy` was always called with the provided arguments.


#### `sinon.assert.neverCalledWith(spy, arg1, arg2, ...);`

Passes if `spy` was never called with the provided arguments.


#### `sinon.assert.calledWithExactly(spyOrSpyCall, arg1, arg2, ...);`

Passes if `spy` was called with the provided arguments and no others.

It's possible to assert on a dedicated spy call: `sinon.assert.calledWithExactly(spy.getCall(1), arg1, arg2, ...);`.


#### `sinon.assert.alwaysCalledWithExactly(spy, arg1, arg2, ...);`

Passes if `spy` was always called with the provided arguments and no others.


#### `sinon.assert.calledWithMatch(spyOrSpyCall, arg1, arg2, ...)`

Passes if `spy` was called with matching arguments.

This behaves the same way as `sinon.assert.calledWith(spy, sinon.match(arg1), sinon.match(arg2), ...)`.

It's possible to assert on a dedicated spy call: `sinon.assert.calledWithMatch(spy.secondCall, arg1, arg2, ...);`.


#### `sinon.assert.alwaysCalledWithMatch(spy, arg1, arg2, ...)`

Passes if `spy` was always called with matching arguments.

This behaves the same way as `sinon.assert.alwaysCalledWith(spy, sinon.match(arg1), sinon.match(arg2), ...)`.


#### `sinon.assert.calledWithNew(spyOrSpyCall)`

Passes if `spy` was called with the `new` operator.

It's possible to assert on a dedicated spy call: `sinon.assert.calledWithNew(spy.secondCall, arg1, arg2, ...);`.


#### `sinon.assert.neverCalledWithMatch(spy, arg1, arg2, ...)`

Passes if `spy` was never called with matching arguments.

This behaves the same way as `sinon.assert.neverCalledWith(spy, sinon.match(arg1), sinon.match(arg2), ...)`.


#### `sinon.assert.threw(spyOrSpyCall, exception);`

Passes if `spy` threw the given exception.

The exception can be a `String` denoting its type, or an actual object.

If only one argument is provided, the assertion passes if `spy` ever threw any exception.

It's possible to assert on a dedicated spy call: `sinon.assert.threw(spy.thirdCall, exception);`.


#### `sinon.assert.alwaysThrew(spy, exception);`

Like above, only required for all calls to the spy.

#### `sinon.assert.match(actual, expectation);`

Uses [`sinon.match`](../matchers) to test if the arguments can be considered a match.

```javascript
var sinon = require('sinon');

describe('example', function(){
    it('should match on `x` property, and ignore `y` property', function() {
        var expected = {x: 1},
            actual = {x: 1, y: 2};

        sinon.assert.match(actual, expected);
    });
});
```

#### `sinon.assert.expose(object, options);`

Exposes assertions into another object, to better integrate with the test framework. For instance, JsTestDriver uses global assertions, and to make Sinon.JS assertions appear alongside them, you can do.

```javascript
sinon.assert.expose(this);
```

This will give you `assertCalled(spy)`,`assertCallOrder(spy1, spy2, ...)` and so on.

The method accepts an optional options object with two options.

<dl>
    <dt>prefix</dt>
    <dd>is a prefix to give assertions. By default it is "assert", so <code>sinon.assert.called</code> becomes <code>target.assertCalled</code>. By passing a blank string, the exposed method will be <code>target.called</code>.</dd>

    <dt>includeFail</dt>
    <dd><code>true</code> by default, copies over the <code>fail</code> and <code>failException</code> properties</dd>
</dl>
