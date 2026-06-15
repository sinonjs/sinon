---
title: assert.calledWithMatch
description: Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called with matching arguments.
---

# `assert.calledWithMatch(spyOrSpyCall, arg1, arg2, ...)`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called with matching arguments.

This behaves the same way as [`sinon.assert.calledWith(spy, sinon.match(arg1), sinon.match(arg2), ...)`][calledWith].

It's possible to assert on a dedicated [spyCall][spy-call]: `sinon.assert.calledWithMatch(spy.secondCall, arg1, arg2, ...);`.

```js
import * as sinon from "sinon";
const fake = sinon.fake();
const applePieExpectation = {
  name: "apple pie"
};
const cherryPieExpectation = {
  name: "cherry pie"
};

fake({
  name: "apple pie",
  price: 123
});

// Matches, generates no error
sinon.assert.calledWithMatch(fake, applePieExpectation);

// Does not match
sinon.assert.calledWithMatch(fake, cherryPieExpectation);
// => Uncaught Error [AssertError]: expected fake to be called with match
// => { name: 'apple pie', price: 123 } { name: 'cherry pie' }
```

## Asserting on a `spyCall`

```js
import * as sinon from "sinon";
const fake = sinon.fake();
const applePieExpectation = {
  name: "apple pie"
};
const cherryPieExpectation = {
  name: "cherry pie"
};

fake({
  name: "apple pie",
  price: 123
});

// get a spyCall instance
const call = fake.firstCall;

// Matches, generates no error
sinon.assert.calledWithMatch(call, applePieExpectation);
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/called-with-match.test.js

[spy-call]: /concepts/spy-call/
[calledWith]: ./called-with
[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
