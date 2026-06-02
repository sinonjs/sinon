---
title: assert.called
description: Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called at least once.
---

# `assert.called(spy);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called at least once.

```js
import * as sinon from "sinon";
const spy = sinon.spy();

sinon.assert.called(spy);
// => Error [AssertError]: expected spy to have been called at least once but was never called

spy();
// Generates no exception
sinon.assert.called(spy);
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/called.test.js

[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
