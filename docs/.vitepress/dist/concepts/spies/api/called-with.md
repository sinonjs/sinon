---
url: /concepts/spies/api/called-with.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called at least once with the provided
  arguments.
---

# `spy.calledWith`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called at least once with the provided arguments.

Can be used for partial matching, Sinon only checks the provided arguments against actual arguments, so a call that received the provided arguments (in the same spots) and possibly others as well will return true.

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.calledWith checks if spy was called with arguments", (t) => {
  const spy = sinon.spy();

  // False before any calls
  t.equal(
    spy.calledWith("apple pie"),
    false,
    "should be false before any calls"
  );

  // True after calling with the argument
  spy("apple pie");
  t.equal(
    spy.calledWith("apple pie"),
    true,
    "should be true after calling with 'apple pie'"
  );

  // False for arguments that were never used
  t.equal(
    spy.calledWith("lemon meringue pie"),
    false,
    "should be false for unused arguments"
  );

  // Reset history
  sinon.resetHistory();

  // False after reset
  t.equal(
    spy.calledWith("apple pie"),
    false,
    "should be false after resetHistory"
  );

  t.end();
});

```

## Resetting `calledWith` to default

You can reset `calledWith` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
