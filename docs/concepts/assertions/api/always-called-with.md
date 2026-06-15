---
title: assert.alwaysCalledWith
description: Passes when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has **always** been called with the provided arguments.
---

# `assert.alwaysCalledWith(spy, arg1, arg2, ...);`

Passes when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has **always** been called with the provided arguments.

```js
import * as sinon from "sinon";
const fake = sinon.fake();

sinon.assert.alwaysCalledWith(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to always be called with arguments

fake("apple pie", "cherry pie");

// Generates no error
sinon.assert.alwaysCalledWith(fake, "apple pie");
sinon.assert.alwaysCalledWith(fake, "cherry pie");

fake("lemon meringue pie");
sinon.assert.alwaysCalledWith(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to always be called with arguments
// => Call 1:
// => '"apple pie"'
// => '"cherry pie"'
// => Call 2:
// => '"lemon meringue pie"' '"apple pie"'
```

If you want to assert that the `fake` was always called with exactly the specified arguments, use [`sinon.assert.alwaysCalledWithExactly`][alwaysCalledWithExactly]

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/always-called-with.test.js

[alwaysCalledWithExactly]: ./always-called-with-exactly
[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
