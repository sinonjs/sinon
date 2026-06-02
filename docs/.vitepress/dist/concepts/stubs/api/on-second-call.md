---
url: /concepts/stubs/api/on-second-call.md
description: '`onSecondCall` is an alias for [`onCall(1)`](./on-call).'
---

# `stub.onSecondCall()`

`onSecondCall` is an alias for [`onCall(1)`](./on-call).

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.onSecondCall", (t) => {
  const callback = sinon.stub();

  callback.onSecondCall().returns("Apple pie");
  callback.returns("Raspberry pie");

  t.equal(callback(), "Raspberry pie", "first call returns Raspberry pie");

  t.equal(callback(), "Apple pie", "second call returns Apple pie");
  t.equal(
    callback(),
    "Raspberry pie",
    "all following calls return Raspberry pie"
  );

  t.end();
});

```

## See also

* [`onFirstCall`](./on-first-call)
* [`onThirdCall`](./on-third-call)
