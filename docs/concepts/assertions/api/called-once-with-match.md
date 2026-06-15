---
title: assert.calledOnceWithMatch
description: Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly once with matching arguments.
---

# `assert.calledOnceWithMatch(spy, arg1, arg2, ...)`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly once with matching arguments.

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
sinon.assert.calledOnceWithMatch(fake, applePieExpectation);

fake({
  name: "apple pie",
  price: 123
});

sinon.assert.calledOnceWithMatch(fake, applePieExpectation);
//=> Uncaught Error [AssertError]: expected fake to be called once and with match
//=> Call 1:
//=> { name: 'apple pie', price: 123 } { name: 'apple pie' }
//=> Call 2:
//=> { name: 'apple pie', price: 123 } { name: 'apple pie' }
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/called-once-with-match.test.js

[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
