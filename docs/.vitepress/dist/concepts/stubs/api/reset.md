---
url: /concepts/stubs/api/reset.md
description: Resets both behavior and history of the stub.
---

# `stub.reset()`

Resets both behavior and history of the stub.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.reset", (t) => {
  const stub = sinon.stub();

  t.equal(stub(), undefined, "stub returns undefined initially");

  stub.returns("Apple pie");

  t.equal(stub(), "Apple pie", "stub returns Apple pie after configuration");

  stub.reset();

  t.equal(stub(), undefined, "stub returns undefined after reset");

  t.end();
});

```

This is equivalent to calling both [`stub.resetBehavior()`](./reset-behavior) and [`stub.resetHistory()`](./reset-history).

As a convenience, you can apply `stub.reset()` to all stubs using [`sinon.reset()`](/concepts/sandboxes/api/reset).
