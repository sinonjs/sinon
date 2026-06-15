---
title: assert.calledThrice
description: Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly three times.
---

# `assert.calledThrice(spy);`

Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly three times.

```js
import * as sinon from "sinon";
const spy = sinon.spy();

sinon.assert.calledThrice(spy);
// => Uncaught Error [AssertError]: expected spy to be called thrice but was called 0 times

spy();
spy();
spy();
// Generates no exception
sinon.assert.calledThrice(spy);

spy();
sinon.assert.calledThrice(spy);
// => Uncaught Error [AssertError]: expected spy to be called thrice but was called 4 times
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/called-thrice.test.js

[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
