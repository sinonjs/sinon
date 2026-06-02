---
url: /concepts/assertions/api/called-with-new.md
description: >-
  Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called
  with the `new` operator.
---

# `assert.calledWithNew(spyOrSpyCall);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called with the `new` operator.

It's possible to assert on a dedicated [spyCall][spy-call]: `sinon.assert.calledWithNew(call);`.

```js
import * as sinon from "sinon";
const fake = sinon.fake();

sinon.assert.calledWithNew(fake);
// => Uncaught Error [AssertError]: expected fake to be called with new

fake();

sinon.assert.calledWithNew(fake);
// => Uncaught Error [AssertError]: expected fake to be called with new

new fake();

// Generates no error
sinon.assert.calledWithNew(fake);
```

## Asserting on a `spyCall`

```js
import * as sinon from "sinon";
const fake = sinon.fake();

new fake();

// get a spyCall instance
const call = fake.firstCall;

// Generates no error
sinon.assert.calledWithNew(call);
```

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.calledWithNew - passes when spy was called with new", (t) => {
  const Ctor = sinon.fake();

  new Ctor();

  t.doesNotThrow(() => {
    sinon.assert.calledWithNew(Ctor);
  }, "assertion should pass");

  t.end();
});

tap.test("assert.calledWithNew - fails when spy was not called", (t) => {
  const Ctor = sinon.fake();

  t.throws(
    () => sinon.assert.calledWithNew(Ctor),
    /expected fake to be called with new/,
    "assertion should fail when not called"
  );

  t.end();
});

tap.test(
  "assert.calledWithNew - fails when spy was called without new",
  (t) => {
    const Ctor = sinon.fake();

    Ctor();

    t.throws(
      () => sinon.assert.calledWithNew(Ctor),
      /expected fake to be called with new/,
      "assertion should fail when called without new"
    );

    t.end();
  }
);

```

[spy-call]: /concepts/spy-call/

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
