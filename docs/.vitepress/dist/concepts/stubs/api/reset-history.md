---
url: /concepts/stubs/api/reset-history.md
description: Resets the stub's history
---

# `stub.resetHistory()`

Resets the stub's history

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.resetHistory", (t) => {
  const stub = sinon.stub();

  t.notOk(stub.called, "stub.called is false initially");

  stub();

  t.ok(stub.called, "stub.called is true after call");

  stub.resetHistory();

  t.notOk(stub.called, "stub.called is false after resetHistory");

  t.end();
});

```

See also:

* [`stub.reset`](./reset)
* [`stub.resetBehavior`](./reset-behavior)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
