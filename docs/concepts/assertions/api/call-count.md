---
title: assert.callCount
description: Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly `num` times.
---

# `assert.callCount(spy, num);`

Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly `num` times.

```js
import * as sinon from "sinon";
const spy = sinon.spy();

sinon.assert.callCount(spy, 1);
// => Uncaught Error [AssertError]: expected spy to be called once but was called 0 times

spy();
// Generates no exception
sinon.assert.callCount(spy, 1);
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/call-count.test.js

[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
