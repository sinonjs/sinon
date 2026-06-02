---
title: assert.alwaysCalledWithExactly
description: Passes when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has **always, only** been called with the provided arguments.
---

# `assert.alwaysCalledWithExactly(spy, arg1, arg2, ...);`

Passes when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has **always, only** been called with the provided arguments.

```js
import * as sinon from "sinon";
const fake = sinon.fake();

sinon.assert.alwaysCalledWithExactly(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to always be called with arguments

fake("apple pie");

// Generates no error
sinon.assert.alwaysCalledWithExactly(fake, "apple pie");

fake("apple pie", "lemon meringue pie");
sinon.assert.alwaysCalledWithExactly(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to always be called with exact // => arguments
// => Call 1:
// => '"apple pie"'
// => Call 2:
// => '"apple pie"'
// => '"lemon meringue pie"'
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/always-called-with-exactly.test.js

[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
