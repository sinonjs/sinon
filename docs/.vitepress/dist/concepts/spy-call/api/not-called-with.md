---
url: /concepts/spy-call/api/not-called-with.md
description: 'Returns `true`, when the spy call did not receive provided arguments.'
---

# `spyCall.notCalledWith(arg1, arg2, ...);`

Returns `true`, when the spy call did not receive provided arguments.

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.notCalledWith returns true,
    when instance did not receive provided arguments`,
  (t) => {
    const f = sinon.fake();

    f("apple pie", Math.PI);

    const sc = f.firstCall;

    t.ok(sc.notCalledWith("cherry pie"));

    t.end();
  }
);

```
