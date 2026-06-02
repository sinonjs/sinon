---
url: /concepts/stubs/api/calls-arg-with.md
description: >-
  Causes the stub to call the argument at the provided `index` as a callback
  function, with the argument(s) provided.
---

# `stub.callsArgWith(index)`

Causes the stub to call the argument at the provided `index` as a callback function, with the argument(s) provided.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArgWith - basic usage", (t) => {
  const stub = sinon.stub().callsArgWith(0, "apple", "banana", "cherry");
  const callback = sinon.fake();

  stub(callback);

  t.ok(callback.calledOnce, "callback was called once");
  t.ok(
    callback.calledWith("apple", "banana", "cherry"),
    "callback was called with provided arguments"
  );

  t.end();
});

tap.test("stub.callsArgWith - errors", (t) => {
  const stub = sinon.stub().callsArgWith(0, "apple", "banana", "cherry");

  t.throws(
    () => stub(undefined),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});

```

## Errors

When the argument at the provided `index` is not available or is not a function, an `Error` will be thrown.

## See also

* [stub.callsArg](./calls-arg)
* [stub.callsArgAsync](./calls-arg-async)
* [stub.callsArgOn](./calls-arg-on)
* [stub.callsArgOnAsync](./calls-arg-on-async)
* [stub.callsArgOnWith](./calls-arg-on-with)
* [stub.callsArgOnWithAsync](./calls-arg-on-with-async)
* [stub.callsArgWithAsync](./calls-arg-with-async)
