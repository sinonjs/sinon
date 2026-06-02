---
url: /concepts/assertions/api/called-once-with-match.md
description: >-
  Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called
  exactly once with matching arguments.
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

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.calledOnceWithMatch - passes when called once with matching arguments",
  (t) => {
    const fake = sinon.fake();
    fake({ name: "Alice", age: 30 });

    t.doesNotThrow(() => {
      sinon.assert.calledOnceWithMatch(fake, { name: "Alice" });
    }, "assertion should pass");

    t.end();
  }
);

tap.test("assert.calledOnceWithMatch - fails when called twice", (t) => {
  const fake = sinon.fake();
  fake({ name: "Alice" });
  fake({ name: "Alice" });

  t.throws(
    () => sinon.assert.calledOnceWithMatch(fake, { name: "Alice" }),
    /expected fake to be called once/,
    "assertion should fail when called more than once"
  );

  t.end();
});

tap.test(
  "assert.calledOnceWithMatch - fails with non-matching arguments",
  (t) => {
    const fake = sinon.fake();
    fake({ name: "Bob" });

    t.throws(
      () => sinon.assert.calledOnceWithMatch(fake, { name: "Alice" }),
      /expected fake to be called once/,
      "assertion should fail with non-matching arguments"
    );

    t.end();
  }
);

```

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
