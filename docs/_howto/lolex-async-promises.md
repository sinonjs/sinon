---
layout: page
title: How to test async functions with fake timers
---

With fake timers (lolex), testing code that depends on timers is easier, as it sometimes
becomes possible to skip the waiting part and trigger scheduled callbacks
synchronously. Consider the following function of a maker module (a module
that makes things):

```js
// maker.js
module.exports.callAfterOneSecond = callback => {
    setTimeout(callback, 1000);
};
```

We can use Mocha with lolex to verify that `callAfterOneSecond` works as expected, but
skipping that part where the test takes one second:

```js
// test.js
before(
    lolex.install();
);
// ...

it('should call after one second', () => {
    const spy = sinon.spy();
    maker.callAfterOneSecond(spy);

    // callback is not called immediately
    assert.ok(!spy.called);

    // but it is called synchronously after the clock is fast forwarded
    clock.tick(1000);
    assert.ok(spy.called); // PASS
});
```

The same approach can be used to test an `async` function:

```js
module.exports.asyncReturnAfterOneSecond = async () => {
    // util.promisify is not used deliberately
    const setTimeoutPromise = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };
    await setTimeoutPromise(1000);
    return 42;
};
```

The following test uses Mocha's [support for promises](https://mochajs.org/#working-with-promises):

```js
// test.js
it('should return 42 after one second', () => {
    const promise = maker.asyncReturnAfterOneSecond();
    clock.tick(1000);
    return promise.then(result => assert.equal(result, 42)); // PASS
});
```

While returning a Promise from Mocha’s test, we can still progress the timers
using lolex, so the test passes almost instantly, and not in 1 second.

Since `async` functions behave the same way as functions that return promises
explicitly, the following code can be tested using the same approach:

```js
// maker.js
module.exports.fulfillAfterOneSecond = () => {
    return new Promise(resolve => {
        setTimeout(() => fulfill(42), 1000);
    });
};
```

```js
// test.js
it('should be fulfilled after one second', () => {
    const promise = maker.fulfillAfterOneSecond();
    clock.tick(1000);
    return promise.then(result => assert.equal(result, 42)); // PASS
});
```

Knowing that `async` functions return promises under the hood,
we can write another test using `async/await`:

```js
// test.js
it('should return 42 after 1000ms', async () => {
    const promise = maker.asyncReturnAfterOneSecond();
    clock.tick(1000);
    const result = await promise;
    assert.equal(result, 42); // PASS
});
```

A callback in the above test still returns a Promise, but for a user it looks
like some straightforward synchronous code.

Although these tests pass almost instantly, they are still asynchronous. Note
that they return promises instead of running the assertions right after the
`clock.tick(1000)` call, like in the first example. **Promises' `then()`
function always runs asynchronously**, but we can still speed up the tests.
