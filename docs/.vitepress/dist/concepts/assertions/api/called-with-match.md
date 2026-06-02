---
url: /concepts/assertions/api/called-with-match.md
description: >-
  Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called
  with matching arguments.
---

# `assert.calledWithMatch(spyOrSpyCall, arg1, arg2, ...)`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called with matching arguments.

This behaves the same way as [`sinon.assert.calledWith(spy, sinon.match(arg1), sinon.match(arg2), ...)`][calledWith].

It's possible to assert on a dedicated [spyCall][spy-call]: `sinon.assert.calledWithMatch(spy.secondCall, arg1, arg2, ...);`.

```js
import * as sinon from "sinon";
const fake = sinon.fake();
const applePieExpectation = {
  name: "apple pie"
};
const cherryPieExpectation = {
  name: "cherry pie"
};

fake({
  name: "apple pie",
  price: 123
});

// Matches, generates no error
sinon.assert.calledWithMatch(fake, applePieExpectation);

// Does not match
sinon.assert.calledWithMatch(fake, cherryPieExpectation);
// => Uncaught Error [AssertError]: expected fake to be called with match
// => { name: 'apple pie', price: 123 } { name: 'cherry pie' }
```

## Asserting on a `spyCall`

```js
import * as sinon from "sinon";
const fake = sinon.fake();
const applePieExpectation = {
  name: "apple pie"
};
const cherryPieExpectation = {
  name: "cherry pie"
};

fake({
  name: "apple pie",
  price: 123
});

// get a spyCall instance
const call = fake.firstCall;

// Matches, generates no error
sinon.assert.calledWithMatch(call, applePieExpectation);
```

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.calledWithMatch - passes when spy was called with matching arguments",
  (t) => {
    const fake = sinon.fake();
    fake({ name: "Alice", age: 30 });

    t.doesNotThrow(() => {
      sinon.assert.calledWithMatch(fake, { name: "Alice" });
    }, "assertion should pass with partial match");

    t.end();
  }
);

tap.test("assert.calledWithMatch - passes with matcher", (t) => {
  const fake = sinon.fake();
  fake("apple pie");

  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.string);
  }, "assertion should pass with matcher");

  t.end();
});

tap.test("assert.calledWithMatch - fails when spy was not called", (t) => {
  const fake = sinon.fake();

  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.string),
    /expected fake to be called with match/,
    "assertion should fail when not called"
  );

  t.end();
});

tap.test("assert.calledWithMatch - fails when arguments don't match", (t) => {
  const fake = sinon.fake();
  fake({ name: "Bob" });

  t.throws(
    () => sinon.assert.calledWithMatch(fake, { name: "Alice" }),
    /expected fake to be called with match/,
    "assertion should fail with non-matching arguments"
  );

  t.end();
});

```

[spy-call]: /concepts/spy-call/

[calledWith]: ./called-with

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
