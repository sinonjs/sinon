---
url: /concepts/assertions/api/always-called-with-exactly.md
description: >-
  Passes when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has **always,
  only** been called with the provided arguments.
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

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.alwaysCalledWithExactly - passes when all calls have exact arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple", "pie");
    fake("apple", "pie");

    t.doesNotThrow(() => {
      sinon.assert.alwaysCalledWithExactly(fake, "apple", "pie");
    }, "assertion should pass");

    t.end();
  }
);

tap.test(
  "assert.alwaysCalledWithExactly - fails when one call has different arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple", "pie");
    fake("apple", "tart");

    t.throws(
      () => sinon.assert.alwaysCalledWithExactly(fake, "apple", "pie"),
      /expected fake to always be called with exact arguments/,
      "assertion should fail with different arguments"
    );

    t.end();
  }
);

```

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
