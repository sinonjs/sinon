---
url: /concepts/sandboxes/api/reset-history.md
description: >-
  Resets the history of all [`fakes`](/concepts/fakes/),
  [`spies`](/concepts/spies/) and [`stubs`](/concepts/stubs/) created using the
  sandbox.
---

# `sandbox.resetHistory();`

Resets the history of all [`fakes`](/concepts/fakes/), [`spies`](/concepts/spies/) and [`stubs`](/concepts/stubs/) created using the sandbox.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "sandbox.resetHistory - resets history of fakes, spies and stubs",
  (t) => {
    // The sinon root object is a default sandbox
    const f = sinon.fake();

    f();
    t.ok(f.called, "fake was called");

    // reset history for everything created using the default sandbox `sinon`
    sinon.resetHistory();
    t.notOk(f.called, "fake history reset");

    t.end();
  }
);

```
