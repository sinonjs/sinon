---
url: /concepts/stubs/api/yields-right.md
description: >-
  Causes the stub to call the last callback it receives with any provided
  arguments.
---

# `stub.yieldsRight()`

Causes the stub to call the last callback it receives with any provided arguments.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yieldsRight - basic usage without arguments", (t) => {
  let assembledCalled = false;
  let bakeCalled = false;

  function assemble() {
    assembledCalled = true;
  }

  function bake(filling = "apple") {
    bakeCalled = true;
    t.equal(filling, "apple", "bake called with default filling");
  }

  const stub = sinon.stub().yieldsRight();
  stub(assemble, bake);

  t.notOk(assembledCalled, "assemble was not called");
  t.ok(bakeCalled, "bake was called");

  t.end();
});

tap.test("stub.yieldsRight - with arguments", (t) => {
  let assembledCalled = false;
  let filling;

  function assemble() {
    assembledCalled = true;
  }

  function bake(f = "apple") {
    filling = f;
  }

  const stubWithArgs = sinon.stub().yieldsRight("raspberry");
  stubWithArgs(assemble, bake);

  t.notOk(assembledCalled, "assemble was not called");
  t.equal(filling, "raspberry", "bake called with raspberry");

  t.end();
});

```

## See also

* [stub.yields](./yields)
* [stub.yieldsAsync](./yields-async)
* [stub.yieldsOn](./yields-on)
* [stub.yieldsOnAsync](./yields-on-async)
* [stub.yieldsTo](./yields-to)
* [stub.yieldsToOn](./yields-to-on)
* [stub.yieldsToAsync](./yields-to-async)
* [stub.yieldsToOnAsync](./yields-to-on-async)
