---
url: /concepts/assertions/api/always-called-with.md
description: >-
  Passes when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has **always**
  been called with the provided arguments.
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

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.alwaysCalledWith - passes when all calls have arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple");
    fake("apple", "pie");
    fake("apple", "pie", "ice cream");

    t.doesNotThrow(() => {
      sinon.assert.alwaysCalledWith(fake, "apple");
    }, "assertion should pass when all calls include argument");

    t.end();
  }
);

tap.test(
  "assert.alwaysCalledWith - fails when one call lacks arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple");
    fake("banana");

    t.throws(
      () => sinon.assert.alwaysCalledWith(fake, "apple"),
      /expected fake to always be called with arguments/,
      "assertion should fail when not all calls include argument"
    );

    t.end();
  }
);

```

[alwaysCalledWithExactly]: ./always-called-with-exactly

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
