---
url: /concepts/spies/api/called-thrice.md
description: >-
  `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) has been called exactly thrice.
---

# `spy.calledThrice`

`true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) has been called exactly thrice.

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.calledThrice is true only when called exactly three times", (t) => {
  const f = sinon.fake();

  // Initially false
  t.equal(f.calledThrice, false, "should be false before any calls");

  // False after first call
  f();
  t.equal(f.calledThrice, false, "should be false after one call");

  // False after second call
  f();
  t.equal(f.calledThrice, false, "should be false after two calls");

  // True after third call
  f();
  t.equal(f.calledThrice, true, "should be true after three calls");

  // False after fourth call
  f();
  t.equal(f.calledThrice, false, "should be false after four calls");

  t.end();
});

```

## Resetting `calledThrice` to default

You can reset `calledThrice` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
