---
title: assert.calledTwice
description: Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly twice.
---

# `assert.calledTwice(spy);`

Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly twice.

```js
import * as sinon from "sinon";
const spy = sinon.spy();

sinon.assert.calledTwice(spy);
// => Uncaught Error [AssertError]: expected spy to be called twice but was called 0 times

spy();
spy();
// Generates no exception
sinon.assert.calledTwice(spy);

spy();
sinon.assert.calledTwice(spy);
// => Uncaught Error [AssertError]: expected spy to be called twice but was called thrice
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/called-twice.test.js

[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
