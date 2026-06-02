---
url: /concepts/assertions/api/threw.md
description: >-
  Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] threw the
  given exception.
---

# `assert.threw(spyOrSpyCall, exception);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] threw the given exception.

The exception can be a `String` denoting its type, or an actual object.

When only one argument is provided, the assertion passes if `spy` ever threw any exception.

It's possible to assert on a dedicated [spyCall][spy-call]: `sinon.assert.threw(spy.thirdCall, exception);`.

```js
import * as sinon from "sinon";
const f1 = sinon.fake();

f1("apple pie");

sinon.assert.threw(f1, "TypeError");
// => Uncaught Error [AssertError]: fake did not throw exception

const f2 = sinon.fake.throws(new TypeError("not an apple pie"));

try {
  f2("apple pie");
} catch (err) {
  // not used
}

// Generates no error
sinon.assert.threw(f2, "TypeError");
```

## Asserting on a `spyCall`

```js
import * as sinon from "sinon";
const f1 = sinon.fake();

f1("apple pie");

// get a spyCall instance
const c1 = f1.firstCall;

sinon.assert.threw(c1, "TypeError");
// => Uncaught Error [AssertError]: fake('apple pie') at REPL4:1:1 did not throw exception

const f2 = sinon.fake.throws(new TypeError("not an apple pie"));

try {
  f2("apple pie");
} catch (err) {
  // not used
}

const c2 = f2.firstCall;

// Generates no error
sinon.assert.threw(c2, "TypeError");
```

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.threw - passes when spy threw", (t) => {
  const fake = sinon.fake.throws(new Error("boom"));

  try {
    fake();
  } catch (e) {}

  t.doesNotThrow(() => {
    sinon.assert.threw(fake);
  }, "assertion should pass when spy threw");

  t.end();
});

tap.test("assert.threw - passes when spy threw specific exception", (t) => {
  const error = new TypeError("type error");
  const fake = sinon.fake.throws(error);

  try {
    fake();
  } catch (e) {}

  t.doesNotThrow(() => {
    sinon.assert.threw(fake, "TypeError");
  }, "assertion should pass with exception type");

  t.end();
});

tap.test("assert.threw - fails when spy didn't throw", (t) => {
  const fake = sinon.fake();

  fake();

  t.throws(
    () => sinon.assert.threw(fake),
    /fake did not throw exception/,
    "assertion should fail when spy didn't throw"
  );

  t.end();
});

```

[spy-call]: /concepts/spy-call/

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
