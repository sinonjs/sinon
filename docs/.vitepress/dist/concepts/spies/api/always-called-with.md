---
url: /concepts/spies/api/always-called-with.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was always called with the provided arguments.
---

# `spy.alwaysCalledWith`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with the provided arguments.

Can be used for partial matching, Sinon only checks the provided arguments against actual arguments, so a call that received the provided arguments (in the same spots) and possibly others as well will return true.

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.alwaysCalledWith checks if always called with args", (t) => {
  const spy = sinon.spy();

  // False before any calls
  t.notOk(spy.alwaysCalledWith("apple pie"), "should be false before calls");

  // True after first call with that arg
  spy("apple pie");
  t.ok(
    spy.alwaysCalledWith("apple pie"),
    "should be true after one matching call"
  );

  // Still true after second call with same arg
  spy("apple pie");
  t.ok(
    spy.alwaysCalledWith("apple pie"),
    "should stay true with consistent args"
  );

  // False for different arg
  t.notOk(
    spy.alwaysCalledWith("lemon meringue pie"),
    "should be false for unused arg"
  );

  // False after call with different arg
  spy("blueberry pie");
  t.notOk(
    spy.alwaysCalledWith("apple pie"),
    "should be false after inconsistent call"
  );

  // Reset
  sinon.resetHistory();
  t.notOk(spy.alwaysCalledWith("apple pie"), "should be false after reset");

  t.end();
});

```

## Resetting `alwaysCalledWith` to default

You can reset `alwaysCalledWith` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
