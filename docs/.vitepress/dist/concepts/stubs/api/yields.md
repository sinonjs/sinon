---
url: /concepts/stubs/api/yields.md
description: >-
  Causes the stub to call the first callback it receives with any provided
  arguments.
---

# `stub.yields()`

Causes the stub to call the first callback it receives with any provided arguments.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yields - basic usage without arguments", (t) => {
  let called = false;

  function bake() {
    called = true;
  }

  const bakeStub = sinon.stub().yields();
  bakeStub(bake);

  t.ok(called, "callback was called");

  t.end();
});

tap.test("stub.yields - with arguments", (t) => {
  let filling;

  function assemble(f) {
    filling = f;
  }

  const assembleStub = sinon.stub().yields("raspberry");
  assembleStub(assemble);

  t.equal(filling, "raspberry", "callback called with raspberry");

  t.end();
});

```

If a method accepts more than one callback, you need to use [`yieldsRight`](./yields-right) to call the last callback or [`callsArg`](./calls-arg) to have the stub invoke other callbacks than the first or last one.

## See also

* [stub.yieldsAsync](./yields-async)
* [stub.yieldsOn](./yields-on)
* [stub.yieldsOnAsync](./yields-on-async)
* [stub.yieldsRight](./yields-right)
* [stub.yieldsTo](./yields-to)
* [stub.yieldsToOn](./yields-to-on)
* [stub.yieldsToAsync](./yields-to-async)
* [stub.yieldsToOnAsync](./yields-to-on-async)
