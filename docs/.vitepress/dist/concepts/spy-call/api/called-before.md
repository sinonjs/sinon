---
url: /concepts/spy-call/api/called-before.md
description: 'Returns `true`, when the spy call occurred before another spy call.'
---

# `spyCall.calledBefore(otherCall)`

Returns `true`, when the spy call occurred before another spy call.

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.calledBefore returns true,
    when instance is called before the argument`,
  (t) => {
    const f = sinon.fake();

    f();
    f();
    f();

    const firstCall = f.firstCall;
    const lastCall = f.lastCall;

    t.ok(firstCall.calledBefore(lastCall));

    t.end();
  }
);

```
