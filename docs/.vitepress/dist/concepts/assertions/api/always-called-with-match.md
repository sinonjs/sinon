---
url: /concepts/assertions/api/always-called-with-match.md
description: >-
  Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was always
  called with matching arguments.
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

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.alwaysCalledWithMatch - passes when all calls match", (t) => {
  const fake = sinon.fake();
  fake({ name: "Alice", age: 30 });
  fake({ name: "Bob", age: 40 });

  t.doesNotThrow(() => {
    sinon.assert.alwaysCalledWithMatch(fake, { age: sinon.match.number });
  }, "assertion should pass when all calls match");

  t.end();
});

tap.test(
  "assert.alwaysCalledWithMatch - fails when one call doesn't match",
  (t) => {
    const fake = sinon.fake();
    fake({ name: "Alice" });
    fake({ name: "Bob", age: 40 });

    t.throws(
      () =>
        sinon.assert.alwaysCalledWithMatch(fake, { age: sinon.match.number }),
      /expected fake to always be called with match/,
      "assertion should fail when not all calls match"
    );

    t.end();
  }
);

```

[always-called-with]: ./always-called-with

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
