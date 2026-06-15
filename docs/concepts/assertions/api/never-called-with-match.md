---
title: assert.neverCalledWithMatch
description: Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was never called with matching arguments.
---

# `assert.neverCalledWithMatch(spy, arg1, arg2, ...)`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was never called with matching arguments.

This behaves the same way as [`sinon.assert.neverCalledWith(spy, sinon.match(arg1), sinon.match(arg2), ...)`][never-called-with].

```js
import * as sinon from "sinon";
const fake = sinon.fake();
const applePieExpectation = {
  name: "apple pie"
};

fake({
  name: "cherry pie",
  price: 123
});

// No match, no error :)
sinon.assert.neverCalledWithMatch(fake, applePieExpectation);

fake({
  name: "apple pie",
  price: 123
});

sinon.assert.neverCalledWithMatch(fake, applePieExpectation);
//=> Uncaught: Error [AssertError]: expected fake to never be called with match { name: 'apple pie' }
//=>     fake({ name: 'cherry pie', price: 123 }) at REPL10:1:1
//=>     fake({ name: 'apple pie', price: 123 }) at REPL16:1:1
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/never-called-with-match.test.js

[never-called-with]: ./never-called-with
[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
