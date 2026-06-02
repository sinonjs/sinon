---
url: /concepts/stubs/api/yield.md
description: Invoke callbacks passed to the `stub` with the given argument(s).
---

# `stub.yield()`

Invoke callbacks passed to the `stub` with the given argument(s).

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yield - basic usage", (t) => {
  const stub = sinon.stub();
  let greeting;

  function callback(name) {
    greeting = `Hello ${name}`;
  }

  stub(callback);

  stub.yield("Mickey Mouse");

  t.equal(
    greeting,
    "Hello Mickey Mouse",
    "callback called with correct argument"
  );

  t.end();
});

```

If the stub was never called with a function argument, `yield` throws an error.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yield - error when no callback passed", (t) => {
  const stub = sinon.stub();

  stub("not a function argument");

  t.throws(
    () => stub.yield("Mickey Mouse"),
    /stub cannot yield since no callback was passed/,
    "throws error when no callback was passed"
  );

  t.end();
});

```

Returns an Array with all callbacks return values, in the order the callbacks were called.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yield - returns array of callback return values", (t) => {
  const stub = sinon.stub();

  function callback1(name) {
    return `Hello ${name}`;
  }

  function callback2(name) {
    return `Goodbye ${name}`;
  }

  stub(callback1);
  stub(callback2);

  const result = stub.yield("Mickey Mouse");

  t.same(
    result,
    ["Hello Mickey Mouse", "Goodbye Mickey Mouse"],
    "returns array with all callback return values"
  );

  t.end();
});

```

`yield` is aliased as `invokeCallback`.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.invokeCallback - alias for yield", (t) => {
  const stub = sinon.stub();
  let greeting;

  function callback(name) {
    greeting = `Hello ${name}`;
  }

  stub(callback);

  stub.invokeCallback("Mickey Mouse");

  t.equal(
    greeting,
    "Hello Mickey Mouse",
    "invokeCallback works as alias for yield"
  );

  t.end();
});

```

## See also

* [`yieldTo`](./yield-to)
