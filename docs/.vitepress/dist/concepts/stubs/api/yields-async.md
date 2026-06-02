---
url: /concepts/stubs/api/yields-async.md
description: >-
  Causes the stub to call the first callback it receives with any provided
  arguments, asynchronously.
---

# `stub.yieldsAsync()`

Causes the stub to call the first callback it receives with any provided arguments, asynchronously.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yieldsAsync - basic usage", async (t) => {
  const clock = sinon.useFakeTimers();
  const stub = sinon.stub().yieldsAsync();

  let value = 0;

  function updateValue() {
    value = 1;
  }

  stub(updateValue);
  t.equal(value, 0, "value is 0 immediately");

  await clock.tickAsync(1);
  t.equal(value, 1, "value is 1 after async callback");

  clock.restore();
  t.end();
});

```

If a method accepts more than one callback, you need to use [`yieldsRight`](./yields-right) to call the last callback or [`callsArg`](./calls-arg) to have the stub invoke other callbacks than the first or last one.

## See also

* [stub.yields](./yields)
* [stub.yieldsOn](./yields-on)
* [stub.yieldsOnAsync](./yields-on-async)
* [stub.yieldsRight](./yields-right)
* [stub.yieldsTo](./yields-to)
* [stub.yieldsToOn](./yields-to-on)
* [stub.yieldsToAsync](./yields-to-async)
* [stub.yieldsToOnAsync](./yields-to-on-async)
