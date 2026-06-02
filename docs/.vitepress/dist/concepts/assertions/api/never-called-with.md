---
url: /concepts/assertions/api/never-called-with.md
description: >-
  Passes when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has never been
  called with the provided arguments.
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

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.neverCalledWith - passes when not called with arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple");

    t.doesNotThrow(() => {
      sinon.assert.neverCalledWith(fake, "banana");
    }, "assertion should pass");

    t.end();
  }
);

tap.test("assert.neverCalledWith - fails when called with arguments", (t) => {
  const fake = sinon.fake();
  fake("apple");

  t.throws(
    () => sinon.assert.neverCalledWith(fake, "apple"),
    /expected fake to never be called with arguments/,
    "assertion should fail when called with specified arguments"
  );

  t.end();
});

```

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
