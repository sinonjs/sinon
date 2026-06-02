---
url: /concepts/spies/api/called-with-exactly.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called at least once with the provided
  arguments and no others.
---

# `spy.calledWithExactly`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called at least once with the provided arguments and no others.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledWithExactly", (t) => {
  const spy = sinon.spy();

  t.notOk(
    spy.calledWithExactly("apple pie"),
    "returns false when spy has not been called"
  );

  spy("apple pie");
  t.ok(
    spy.calledWithExactly("apple pie"),
    "returns true when called with exact arguments"
  );

  // reset the history of everything
  sinon.resetHistory();

  spy("apple pie", "blueberry pie");
  spy("apple pie", "blueberry pie");
  spy("apple pie", "blueberry pie");

  t.ok(
    spy.calledWithExactly("apple pie", "blueberry pie"),
    "returns true when called with exact multiple arguments"
  );

  // reset the history of everything
  sinon.resetHistory();

  t.notOk(
    spy.calledWithExactly("apple pie", "blueberry pie"),
    "returns false after reset with no calls"
  );

  // reset the history of everything
  sinon.resetHistory();

  spy("apple pie");
  spy("blueberry pie");
  t.ok(
    spy.calledWithExactly("apple pie"),
    "returns true when spy was called with exact arguments (at least once)"
  );

  t.end();
});

```

## Resetting `calledWithExactly` to default

You can reset `calledWithExactly` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
