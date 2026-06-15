---
title: assert.calledOnceWithExactly
description: Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly once, with exactly the provided arguments.
---

# `assert.calledOnceWithExactly(spyOrSpyCall, arg1, arg2, ...);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly once, with exactly the provided arguments.

It's possible to assert on a dedicated [spyCall][spy-call]: `sinon.assert.calledOnceWithExactly(call, arg1, arg2, ...);`.

```js
import * as sinon from "sinon";
const fake = sinon.fake();

sinon.assert.calledOnceWithExactly(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to be called with exact arguments

fake("apple pie");

// Generates no error
sinon.assert.calledOnceWithExactly(fake, "apple pie");

fake("apple pie");
sinon.assert.calledOnceWithExactly(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to be called once and with exact arguments
// => Call 1:
// => '"apple pie"'
// => Call 2:
// => '"apple pie"'
```

## Asserting on a `spyCall`

```js
import * as sinon from "sinon";
const fake = sinon.fake();

fake("apple pie");

// get a spyCall instance
const call = fake.firstCall;

// Generates no error
sinon.assert.calledOnceWithExactly(fake, "apple pie");
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/called-once-with-exactly.test.js

[spy-call]: /concepts/spy-call/
[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
