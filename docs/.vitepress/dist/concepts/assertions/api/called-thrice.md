---
url: /concepts/assertions/api/called-thrice.md
description: >-
  Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called
  exactly three times.
---

# `assert.calledThrice(spy);`

Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly three times.

```js
import * as sinon from "sinon";
const spy = sinon.spy();

sinon.assert.calledThrice(spy);
// => Uncaught Error [AssertError]: expected spy to be called thrice but was called 0 times

spy();
spy();
spy();
// Generates no exception
sinon.assert.calledThrice(spy);

spy();
sinon.assert.calledThrice(spy);
// => Uncaught Error [AssertError]: expected spy to be called thrice but was called 4 times
```

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.calledThrice - passes when spy was called thrice", (t) => {
  const spy = sinon.spy();
  spy();
  spy();
  spy();

  t.doesNotThrow(() => {
    sinon.assert.calledThrice(spy);
  }, "assertion should pass");

  t.end();
});

tap.test("assert.calledThrice - fails when spy was called twice", (t) => {
  const spy = sinon.spy();
  spy();
  spy();

  t.throws(
    () => sinon.assert.calledThrice(spy),
    /expected spy to be called thrice but was called twice/,
    "assertion should fail with descriptive message"
  );

  t.end();
});

```

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
