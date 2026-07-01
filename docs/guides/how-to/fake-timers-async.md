---
title: How to test async functions with fake timers
---

# How to test async functions with fake timers

With fake timers, testing code that depends on timers is easier, as it sometimes
becomes possible to skip the waiting part and trigger scheduled callbacks
synchronously. Consider the following function of a maker module:

```js
// maker.js
module.exports.callAfterOneSecond = (callback) => {
  setTimeout(callback, 1000);
};
```

We can use a test runner with Sinon's fake timers to verify that `callAfterOneSecond` works as expected, but
skipping that part where the test takes one second:

```js
// test.js
before(function () {
  this.clock = sinon.useFakeTimers();
});

after(function () {
  this.clock.restore();
});

it("should call after one second", function () {
  const spy = sinon.spy();
  maker.callAfterOneSecond(spy);

  // callback is not called immediately
  assert.ok(!spy.called);

  // but it is called synchronously after the clock is fast forwarded
  this.clock.tick(1000);
  assert.ok(spy.called); // PASS
});
```

The same approach can be used to test a function returning a promise:

```js
module.exports.fulfillAfterOneSecond = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(42), 1000);
  });
};
```

The following test uses a test runner's support for promises:

```js
it("should be fulfilled after one second", function () {
  const promise = maker.fulfillAfterOneSecond();
  this.clock.tick(1000);
  return promise.then((result) => assert.equal(result, 42)); // PASS
});
```

While returning a promise from the test, we can still progress the timers
using fake timers, so the test passes almost instantly, and not in 1 second.

Since `async` functions behave the same way as functions that return promises
explicitly, the following code can be tested using the same approach:

```js
// maker.js
module.exports.asyncReturnAfterOneSecond = async () => {
  const setTimeoutPromise = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  await setTimeoutPromise(1000);
  return 42;
};
```

```js
it("should return 42 after 1000ms", async function () {
  const promise = maker.asyncReturnAfterOneSecond();
  this.clock.tick(1000);
  const result = await promise;
  assert.equal(result, 42); // PASS
});
```

Although these tests pass almost instantly, they are still asynchronous. Note
that they return promises instead of running the assertions right after the
`clock.tick(1000)` call, like in the first example. **Promises' `then()`
function always runs asynchronously**, but we can still speed up the tests.
