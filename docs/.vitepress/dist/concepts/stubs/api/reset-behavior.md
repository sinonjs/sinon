---
url: /concepts/stubs/api/reset-behavior.md
description: Resets the stub's behavior to the default behavior
---

# `stub.resetBehavior()`

Resets the stub's behavior to the default behavior

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.resetBehavior", (t) => {
  const stub = sinon.stub();

  stub.returns(54);

  t.equal(stub(), 54, "stub returns 54");

  stub.resetBehavior();

  t.equal(typeof stub(), "undefined", "stub returns undefined after reset");

  t.end();
});

```

See also:

* [`stub.reset`](./reset)
* [`stub.resetHistory`](./reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
