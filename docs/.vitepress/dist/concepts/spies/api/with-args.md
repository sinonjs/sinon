---
url: /concepts/spies/api/with-args.md
description: >-
  Creates a [`spy`](../) or [`stub`](/concepts/stubs/) that only records
  [calls](/concepts/spy-call/) when the received arguments match those passed to
  `withArgs`. This is useful to be more expressive in your ...
---

# `spy.withArgs`

Creates a [`spy`](../) or [`stub`](/concepts/stubs/) that only records [calls](/concepts/spy-call/) when the received arguments match those passed to `withArgs`. This is useful to be more expressive in your assertions, where you can access the spy with the same [call](/concepts/spy-call/).

Uses deep comparison for objects and arrays. Use `spy.withArgs(sinon.match.same(obj))` for strict comparison (see [matchers](/concepts/matchers/)).

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.withArgs", (t) => {
  const object = { method() {} };
  const spy = sinon.spy(object, "method");

  object.method(42);
  object.method(1);

  t.ok(spy.withArgs(42).calledOnce, "spy.withArgs(42) was called once");

  t.ok(spy.withArgs(1).calledOnce, "spy.withArgs(1) was called once");

  object.method("a", "b", "c");
  t.ok(
    spy.withArgs("a", "b", "c").calledOnce,
    "spy.withArgs with multiple arguments was called once"
  );

  spy.restore();
  t.end();
});

```
