---
title: assert.calledWithNew
description: Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called with the `new` operator.
---

# `assert.calledWithNew(spyOrSpyCall);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called with the `new` operator.

It's possible to assert on a dedicated [spyCall][spy-call]: `sinon.assert.calledWithNew(call);`.

```js
import * as sinon from "sinon";
const fake = sinon.fake();

sinon.assert.calledWithNew(fake);
// => Uncaught Error [AssertError]: expected fake to be called with new

fake();

sinon.assert.calledWithNew(fake);
// => Uncaught Error [AssertError]: expected fake to be called with new

new fake();

// Generates no error
sinon.assert.calledWithNew(fake);
```

## Asserting on a `spyCall`

```js
import * as sinon from "sinon";
const fake = sinon.fake();

new fake();

// get a spyCall instance
const call = fake.firstCall;

// Generates no error
sinon.assert.calledWithNew(call);
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/called-with-new.test.js

[spy-call]: /concepts/spy-call/
[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
