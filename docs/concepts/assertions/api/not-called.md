---
title: assert.notCalled
description: Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has not been called.
---

# `assert.notCalled(spy);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has not been called.

```js
import * as sinon from "sinon";
const spy = sinon.spy();

// No exception!
sinon.assert.notCalled(spy);

spy();
sinon.assert.notCalled(spy);
// => Uncaught Error [AssertError]: expected spy to not have been called but was called once
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/not-called.test.js

[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
