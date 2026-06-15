---
title: assert.alwaysCalledWithMatch
description: Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was always called with matching arguments.
---

# `assert.alwaysCalledWithMatch(spy, arg1, arg2, ...)`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was always called with matching arguments.

This behaves the same way as [`sinon.assert.alwaysCalledWith(spy, sinon.match(arg1), sinon.match(arg2), ...)`][always-called-with].

```js
import * as sinon from "sinon";
const fake = sinon.fake();
const applePieExpectation = {
  name: "apple pie"
};

fake({
  name: "apple pie",
  price: 123
});

// Matches, generates no error
sinon.assert.alwaysCalledWithMatch(fake, applePieExpectation);

fake({
  name: "cherry pie",
  price: 123
});

sinon.assert.alwaysCalledWithMatch(fake, applePieExpectation);
//=> Uncaught Error [AssertError]: expected fake to always be called with match
//=> Call 1:
//=> { name: 'apple pie', price: 123 } { name: 'apple pie' }
//=> Call 2:
//=> { name: 'cherry pie', price: 123 } { name: 'apple pie' }
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/always-called-with-match.test.js

[always-called-with]: ./always-called-with
[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
