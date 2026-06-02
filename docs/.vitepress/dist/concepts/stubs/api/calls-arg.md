---
url: /concepts/stubs/api/calls-arg.md
description: >-
  Causes the stub to call the argument at the provided `index` as a callback
  function.
---

# `stub.callsArg(index)`

Causes the stub to call the argument at the provided `index` as a callback function.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArg - basic usage", (t) => {
  const stub = sinon.stub().callsArg(0);
  const callback = sinon.fake();

  stub(callback);

  t.ok(callback.called, "callback was called");

  t.end();
});

tap.test("stub.callsArg - errors", (t) => {
  const stub = sinon.stub().callsArg(0);

  t.throws(
    () => stub(),
    /callsArg failed: 1 arguments required but only 0 present/,
    "throws when no arguments provided"
  );

  t.throws(
    () => stub("definitely not a function"),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});

```

## Errors

When the argument at the provided `index` is not available or is not a function, an `Error` will be thrown.

## See also

* [stub.callsArgAsync](./calls-arg-async)
* [stub.callsArgOn](./calls-arg-on)
* [stub.callsArgOnAsync](./calls-arg-on-async)
* [stub.callsArgOnWith](./calls-arg-on-with)
* [stub.callsArgOnWithAsync](./calls-arg-on-with-async)
* [stub.callsArgWith](./calls-arg-with)
* [stub.callsArgWithAsync](./calls-arg-with-async)
