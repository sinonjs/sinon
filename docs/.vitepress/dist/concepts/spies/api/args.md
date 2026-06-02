---
url: /concepts/spies/api/args.md
description: >-
  Array of arguments received, `spy.args[0]` is an array of arguments received
  in the first [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/),
  [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.args`

Array of arguments received, `spy.args[0]` is an array of arguments received in the first [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.args contains all arguments from all calls", (t) => {
  const f = sinon.fake();

  // Call with different arguments
  f("a", "b", "c");
  f("d", "e", "f");

  // Verify args structure
  t.same(
    f.args,
    [
      ["a", "b", "c"],
      ["d", "e", "f"]
    ],
    "args should contain all calls"
  );
  t.same(f.args[0], ["a", "b", "c"], "args[0] should be first call arguments");

  t.end();
});

```

## Resetting `args` to default

You can reset `args` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
