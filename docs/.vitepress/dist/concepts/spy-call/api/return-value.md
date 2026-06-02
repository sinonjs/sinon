---
url: /concepts/spy-call/api/return-value.md
description: This property contains a reference to the value returned from the call.
---

## `spyCall.returnValue`

This property contains a reference to the value returned from the call.

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.returnValue contains a reference to the
    value returned from the call`,
  (t) => {
    const pie = {
      name: "apple pie"
    };
    const f1 = sinon.fake.returns(pie);
    const f2 = sinon.fake();

    f1();

    t.equal(f1.lastCall.returnValue, pie);

    f2();

    t.equal(f2.lastCall.returnValue, undefined);

    t.end();
  }
);

```
