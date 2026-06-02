---
url: /concepts/spy-call/api/not-called-with-match.md
description: >-
  Returns `true`, when the spyt call did not receive matching arguments. This
  behaves the same as [`spyCall.notCalledWith(sinon.match(arg1),
  sinon.match(arg2), ...)`](./not-called-with).
---

# `spyCall.notCalledWithMatch(arg1, arg2, ...);`

Returns `true`, when the spyt call did not receive matching arguments.
This behaves the same as [`spyCall.notCalledWith(sinon.match(arg1), sinon.match(arg2), ...)`](./not-called-with).

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.notCalledWithMatch returns true,
    when instance received matching arguments`,
  (t) => {
    const f = sinon.fake();
    const dish = {
      name: "apple pie",
      price: Math.PI
    };

    f(dish);

    const sc = f.firstCall;

    t.ok(sc.notCalledWithMatch(sinon.match({ name: "cherry pie" })));

    t.end();
  }
);

```
