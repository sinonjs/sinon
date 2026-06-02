---
url: /concepts/sandboxes/api/reset-behavior.md
description: Resets the behavior of all stubs created through the sandbox.
---

# `sandbox.resetBehavior();`

Resets the behavior of all stubs created through the sandbox.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.resetBehavior - resets behavior of all stubs", (t) => {
  // The sinon root object is a default sandbox
  const stub = sinon.stub();

  stub.returns(54);

  t.equal(stub(), 54, "stub returns 54");

  sinon.resetBehavior();

  t.equal(typeof stub(), "undefined", "stub returns undefined after reset");

  t.end();
});

```
