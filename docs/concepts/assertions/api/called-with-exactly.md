---
title: assert.calledWithExactly
description: Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called with exactly the provided arguments.
---

# `assert.calledWithExactly(spyOrSpyCall, arg1, arg2, ...);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called with exactly the provided arguments.

It's possible to assert on a dedicated [spyCall][spy-call]: `sinon.assert.calledWithExactly(call, arg1, arg2, ...);`.

```js
import * as sinon from "sinon";
const fake = sinon.fake();

sinon.assert.calledWithExactly(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to be called with exact arguments

fake("apple pie");

// Generates no error
sinon.assert.calledWithExactly(fake, "apple pie");

sinon.assert.calledWithExactly(fake, "lemon meringue pie");
// => Uncaught Error [AssertError]: expected fake to be called with exact arguments
// => '"apple pie"' '"lemon meringue pie"'

// reset the history of everything
sinon.resetHistory();

sinon.assert.calledWithExactly(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to be called with exact arguments
```

## Asserting on a `spyCall`

```js
import * as sinon from "sinon";
const fake = sinon.fake();

fake("apple pie");

// get a spyCall instance
const call = fake.firstCall;

// Generates no error
sinon.assert.calledWithExactly(call, "apple pie");
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/called-with-exactly.test.js

[spy-call]: /concepts/spy-call/
[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
