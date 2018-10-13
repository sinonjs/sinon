---
layout: page
title: How to speed up time with lolex
---

With lolex, testing code that depends on timers is easier, as it sometimes
becomes possible to skip the waiting part and trigger scheduled callbacks
synchronously. Consider the following function of a maker module (a module
that makes things):

```js
// maker.js
module.exports.callAfterOneSecond = callback => {
    setTimeout(callback, 1000);
};
```

We can use lolex to verify that `callAfterOneSecond` works as expected, but
skipping that part where the test takes one second:

```js
// test.js
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

We could expect similar behavior from a promisified timeout:

```js
// maker.js
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

module.exports.asyncReturnAfterOneSecond = async () => {
    await setTimeoutPromise(1000);
    return 42;
};
```

Trying a naive approach:

```js
// test.js
it('should return 42 after one second', () => {
    // result will hold a Promise after the next call
    const result = maker.asyncReturnAfterOneSecond();

    clock.tick(1000);

    // the Promise was not resolved,
    // even though we moved the time forward
    assert.equal(result, 42); // FAIL
});
```

The above test fails, since `asyncReturnAfterOneSecond` is an `async` function
that returns a Promise, and it is currently impossible to control the Promises'
forced resolution. **Their `then()` function always runs asynchronously**.

It doesn't mean that `async` functions and Promises cannot be tested though.
The most intuitive way to test the above `asyncReturnAfterOneSecond` is to
simply wait for one second:

```js
// test.js

// using async await
it('should return 42 after one second', async () => {
    const result = await maker.asyncReturnAfterOneSecond();
    assert.equal(result, 42); // PASS
});

// or using Mocha's promises
it('should return 42 after one second', () => {
    const promise = maker.asyncReturnAfterOneSecond();

    // this call does not really speed up anything
    clock.tick(1000);

    return promise.then(result => assert.equal(result, 42)); // PASS
});
```

Although `async` functions cannot be tested synchronously, we can test Promises
that are resolved in `setTimeout`. Consider the following function, that has the
same functionality as `asyncReturnAfterOneSecond`:

```js
// maker.js
module.exports.fulfillAfterOneSecond = () => {
    return new Promise(fulfill => {
        setTimeout(() => fulfill(42), 1000);
    });
};
```

`fulfillAfterOneSecond` resolves to 42 after one second, just like
`asyncReturnAfterOneSecond`, but it is testable in a synchronous way:

```js
// test.js
it('should be fulfilled after one second', () => {
    const promise = maker.fulfillAfterOneSecond();

    // this call actually makes the resolution quicker
    clock.tick(1000);
    return promise.then(result => assert.equal(result, 42)); // PASS
});
```

The above test passes immediately, without the 1 second delay. This is because
we do not try to hijack `then()` call, but use Mocha's native ability to test
Promises, while speeding up their resolution.

Although it is currently impossible to speed up `async` functions, or even
Promises that are not resolved directly in `setTimeout`'s callback, there is a
discussion around this limitation. There is a chance that it will become
possible to force `then()` execution in the future, meaning that the things that
are impossible today may become possible at some point.
