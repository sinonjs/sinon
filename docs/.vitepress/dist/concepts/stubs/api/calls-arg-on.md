---
url: /concepts/stubs/api/calls-arg-on.md
description: >-
  Causes the stub to call the argument at the provided `index` as a callback
  function, with an additional `object` parameter to pass the
  [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
  context.
---

# `stub.callsArgOn(index, object)`

Causes the stub to call the argument at the provided `index` as a callback function, with an additional `object` parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArgOn - basic usage", (t) => {
  const person = {
    name: "Mickey Mouse"
  };
  const stub = sinon.stub().callsArgOn(0, person);
  let capturedThis;

  function hello() {
    capturedThis = this;
  }

  stub(hello);

  t.equal(capturedThis, person, "callback called with person as this");
  t.equal(capturedThis.name, "Mickey Mouse", "this.name is Mickey Mouse");

  t.end();
});

tap.test("stub.callsArgOn - errors", (t) => {
  const person = {
    name: "Mickey Mouse"
  };
  const stub = sinon.stub().callsArgOn(0, person);

  t.throws(
    () => stub(),
    /callsArg failed: 1 arguments required but only 0 present/,
    "throws when no arguments provided"
  );

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
* [stub.callsArgOnAsync](./calls-arg-on-async)
* [stub.callsArgOnWith](./calls-arg-on-with)
* [stub.callsArgOnWithAsync](./calls-arg-on-with-async)
* [stub.callsArgWith](./calls-arg-with)
* [stub.callsArgWithAsync](./calls-arg-with-async)
* [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
