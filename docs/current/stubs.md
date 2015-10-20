# Stubs


## What are stubs?

Test stubs are functions (spies) with pre-programmed behavior.

They support the full <a href="#spies">test spy API</a> in addition to methods which can be used to alter the stub's behavior.

As spies, stubs can be either anonymous, or wrap existing functions. When
wrapping an existing function with a stub, the original function is not called.


## When to use stubs?

Use a stub when you want to:

1. Control a method's behavior from a test to force the code down a specific path. Examples include forcing a method to throw an error in order to test error handling.

2. When you want to prevent a specific method from being called directly (possibly because it triggers undesired behavior, such as a `XMLHttpRequest or similar).

The following example is yet another test from [PubSubJS][pubsubjs] which shows how to create an anonymous stub that throws an exception when called.

```javascript
"test should call all subscribers, even if there are exceptions" : function(){
    var message = 'an example message';
    var error = 'an example error message';
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
[`onCall`]("#stub-onCall) method to make a stub respond differently on
consecutive calls.

Note that in Sinon version 1.5 to version 1.7, multiple calls to the `yields*`
and `callsArg*` family of methods define a sequence of behaviors for consecutive
calls. As of 1.8, this functionality has been removed in favor of the <a
href="#stub-onCall"><code>onCall</code></a> API.

[pubsubjs]: https://github.com/mroderick/pubsubjs
