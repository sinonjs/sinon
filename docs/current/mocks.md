# Mocks

## What are mocks?

Mocks (and mock expectations) are fake methods (like spies) with pre-programmed behavior (like stubs) as well as **pre-programmed expectations**.

A mock will fail your test if it is not used as expected.


## When to use mocks?

Mocks should only be used for the *method under test*. In every unit test, there should be one unit under test.

If you want to control how your unit is being used and like stating expectations upfront (as opposed to asserting after the fact), use a mock.


## When to **not** use mocks?

Mocks come with built-in expectations that may fail your test.

Thus, they enforce implementation details. The rule of thumb is: if you wouldn't add an assertion for some specific call, don't mock it. Use a stub instead.

In general you should never have more than **one** mock (possibly with several expectations) in a single test.

[Expectations](#expectations) implement both the [spies](#spies) and [stubs](#stubs) APIs.

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
