---
url: /concepts/spy-call/api/called-with-match.md
description: >-
  Returns `true`, when the spy call received matching arguments (and possibly
  others).
---

# `spyCall.calledWithMatch(arg1, arg2, ...);`

Returns `true`, when the spy call received matching arguments (and possibly others).

This behaves the same as [`spyCall.calledWith(sinon.match(arg1), sinon.match(arg2), ...)`](./called-with).

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.calledWithMatch returns true,
    when instance received matching arguments`,
  (t) => {
    const f = sinon.fake();
    const dish = {
      name: "apple pie",
      price: Math.PI
    };

    f(dish);

    const sc = f.firstCall;

    t.ok(sc.calledWithMatch(sinon.match({ name: "apple pie" })));

    t.end();
  }
);

```
