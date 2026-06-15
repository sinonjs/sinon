---
title: assert.neverCalledWith
description: Passes when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has never been called with the provided arguments.
---

# `assert.neverCalledWith(spy, arg1, arg2, ...);`

Passes when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has never been called with the provided arguments.

```js
import * as sinon from "sinon";
const fake = sinon.fake();

// Generates no error
sinon.assert.neverCalledWith(fake, "apple pie");

fake("apple pie");

sinon.assert.neverCalledWith(fake, "apple pie");
// => Uncaught: Error [AssertError]: expected fake to never be called with arguments 'apple pie'

// Generates no error
sinon.assert.neverCalledWith(fake, "lemon meringue pie");
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/never-called-with.test.js

[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
