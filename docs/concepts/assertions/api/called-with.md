---
title: assert.calledWith
description: Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called with the provided arguments.
---

# `assert.calledWith(spyOrSpyCall, arg1, arg2, ...);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called with the provided arguments.

It's possible to assert on a dedicated [spyCall][spy-call]: `sinon.assert.calledWith(call, arg1, arg2, ...);`.

```js
import * as sinon from "sinon";
const fake = sinon.fake();

sinon.assert.calledWith(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to be called with arguments

fake("apple pie");

// Generates no error
sinon.assert.calledWith(fake, "apple pie");

sinon.assert.calledWith(fake, "lemon meringue pie");
// => Uncaught Error [AssertError]: expected fake to be called with arguments
// => '"apple pie"' '"lemon meringue pie"'
```

## Asserting on a `spyCall`

```js
import * as sinon from "sinon";
const fake = sinon.fake();

fake("apple pie");

// get a spyCall instance
const call = fake.firstCall;

// Generates no error
sinon.assert.calledWith(call, "apple pie");
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/called-with.test.js

[spy-call]: /concepts/spy-call/
[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
