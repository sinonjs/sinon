---
url: /concepts/assertions/api/called-once-with-exactly.md
description: >-
  Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called
  exactly once, with exactly the provided arguments.
---

# `assert.calledOnceWithExactly(spyOrSpyCall, arg1, arg2, ...);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly once, with exactly the provided arguments.

It's possible to assert on a dedicated [spyCall][spy-call]: `sinon.assert.calledOnceWithExactly(call, arg1, arg2, ...);`.

```js
import * as sinon from "sinon";
const fake = sinon.fake();

sinon.assert.calledOnceWithExactly(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to be called with exact arguments

fake("apple pie");

// Generates no error
sinon.assert.calledOnceWithExactly(fake, "apple pie");

fake("apple pie");
sinon.assert.calledOnceWithExactly(fake, "apple pie");
// => Uncaught Error [AssertError]: expected fake to be called once and with exact arguments
// => Call 1:
// => '"apple pie"'
// => Call 2:
// => '"apple pie"'
```

## Asserting on a `spyCall`

```js
import * as sinon from "sinon";
const fake = sinon.fake();

fake("apple pie");

// get a spyCall instance
const call = fake.firstCall;

// Generates no error
sinon.assert.calledOnceWithExactly(fake, "apple pie");
```

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.calledOnceWithExactly - passes when called once with exact arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple", "pie");

    t.doesNotThrow(() => {
      sinon.assert.calledOnceWithExactly(fake, "apple", "pie");
    }, "assertion should pass");

    t.end();
  }
);

tap.test("assert.calledOnceWithExactly - fails when called twice", (t) => {
  const fake = sinon.fake();
  fake("apple", "pie");
  fake("apple", "pie");

  t.throws(
    () => sinon.assert.calledOnceWithExactly(fake, "apple", "pie"),
    /expected fake to be called once/,
    "assertion should fail when called more than once"
  );

  t.end();
});

tap.test("assert.calledOnceWithExactly - fails with wrong arguments", (t) => {
  const fake = sinon.fake();
  fake("apple");

  t.throws(
    () => sinon.assert.calledOnceWithExactly(fake, "apple", "pie"),
    /expected fake to be called once/,
    "assertion should fail with wrong arguments"
  );

  t.end();
});

```

[spy-call]: /concepts/spy-call/

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
