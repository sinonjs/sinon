---
title: assert.calledOnce
description: Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly once.
---

# `assert.calledOnce(spy);`

Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly once.

```js
import * as sinon from "sinon";
const spy = sinon.spy();

sinon.assert.calledOnce(spy);
// => Error [AssertError]: expected spy to be called once but was called 0 times

spy();
// Generates no exception
sinon.assert.calledOnce(spy);

spy();
sinon.assert.calledOnce(spy);
// => Error [AssertError]: expected spy to be called once but was called twice
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/called-once.test.js

[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
