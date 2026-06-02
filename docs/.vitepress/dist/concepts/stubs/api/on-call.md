---
url: /concepts/stubs/api/on-call.md
description: >-
  Defines the behavior of the stub on the _nth_ call. Useful for testing
  sequential interactions.
---

# `stub.onCall(index)`

Defines the behavior of the stub on the *nth* call. Useful for testing sequential interactions.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.onCall - basic usage", (t) => {
  const callback = sinon.stub();

  callback.onCall(0).returns("Apple pie");
  callback.onCall(1).returns("Blueberry pie");
  callback.returns("Raspberry pie");

  t.equal(callback(), "Apple pie", "first call returns Apple pie");

  t.equal(callback(), "Blueberry pie", "second call returns Blueberry pie");

  t.equal(callback(), "Raspberry pie", "third call returns Raspberry pie");
  t.equal(
    callback(),
    "Raspberry pie",
    "all following calls return Raspberry pie"
  );

  t.end();
});

```

There are convenience methods [`onFirstCall`](./on-first-call), [`onSecondCall`](./on-second-call), [`onThirdCall`](./on-third-call) to improve readability of stub definitions.

`onCall` can be combined with all of the behavior defining methods in this API. In particular, it can be used together with `withArgs`.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.onCall with withArgs", (t) => {
  const callback = sinon.stub();
  const FORTY_TWO = 42;
  const UNKNOWN_VALUE = "any unknown value";

  callback
    .withArgs(FORTY_TWO)
    .onFirstCall()
    .returns("Apple pie")
    .onSecondCall()
    .returns("Blueberry pie");

  callback.returns("Raspberry pie");

  t.equal(
    callback(UNKNOWN_VALUE),
    "Raspberry pie",
    "unknown value returns default"
  );

  t.equal(
    callback(FORTY_TWO),
    "Apple pie",
    "first call with 42 returns Apple pie"
  );

  t.equal(
    callback(UNKNOWN_VALUE),
    "Raspberry pie",
    "unknown value returns default"
  );

  t.equal(
    callback(FORTY_TWO),
    "Blueberry pie",
    "second call with 42 returns Blueberry pie"
  );

  t.equal(
    callback(FORTY_TWO),
    "Raspberry pie",
    "third call with 42 falls back to default"
  );

  t.end();
});

```

Note how the behavior of the stub for argument `FORTY_TWO` falls back to the default behavior once no more calls have been defined.
