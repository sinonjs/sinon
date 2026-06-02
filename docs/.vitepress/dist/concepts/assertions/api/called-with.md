---
url: /concepts/assertions/api/called-with.md
description: >-
  Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called
  with the provided arguments.
---

# `assert.calledWith(spyOrSpyCall, arg1, arg2, ...);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called with the provided arguments.

It's possible to assert on a dedicated [spyCall][spy-call]: `sinon.assert.calledWith(call, arg1, arg2, ...);`.

```js
import * as sinon from "sinon";
const fake = sinon.fake();

sinon.assert.calledWith(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to be called with arguments

fake("apple pie");

// Generates no error
sinon.assert.calledWith(fake, "apple pie");

sinon.assert.calledWith(fake, "lemon meringue pie");
// => Uncaught Error [AssertError]: expected fake to be called with arguments
// => '"apple pie"' '"lemon meringue pie"'
```

## Asserting on a `spyCall`

```js
import * as sinon from "sinon";
const fake = sinon.fake();

fake("apple pie");

// get a spyCall instance
const call = fake.firstCall;

// Generates no error
sinon.assert.calledWith(call, "apple pie");
```

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.calledWith - passes when spy was called with arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple pie");

    t.doesNotThrow(() => {
      sinon.assert.calledWith(fake, "apple pie");
    }, "assertion should pass");

    t.end();
  }
);

tap.test("assert.calledWith - fails when spy was not called", (t) => {
  const fake = sinon.fake();

  t.throws(
    () => sinon.assert.calledWith(fake, "apple pie"),
    /expected fake to be called with arguments/,
    "assertion should fail when not called"
  );

  t.end();
});

tap.test(
  "assert.calledWith - fails when spy was called with different arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple pie");

    t.throws(
      () => sinon.assert.calledWith(fake, "lemon meringue pie"),
      /expected fake to be called with arguments/,
      "assertion should fail with wrong arguments"
    );

    t.end();
  }
);

tap.test("assert.calledWith - works with spyCall", (t) => {
  const fake = sinon.fake();
  fake("apple pie");

  const call = fake.firstCall;

  t.doesNotThrow(() => {
    sinon.assert.calledWith(call, "apple pie");
  }, "assertion should work on spyCall");

  t.end();
});

```

[spy-call]: /concepts/spy-call/

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
