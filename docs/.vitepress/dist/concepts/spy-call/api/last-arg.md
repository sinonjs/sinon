---
url: /concepts/spy-call/api/last-arg.md
description: This property contains a reference to the last argument of the call.
---

# `spyCall.lastArg`

This property contains a reference to the last argument of the call.

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.lastArg contains a reference
    to the last argument of the call`,
  (t) => {
    const f = sinon.fake();

    f("apple pie", "banana pie");

    t.equal(f.lastCall.lastArg, "banana pie");

    f();
    t.equal(f.lastCall.lastArg, undefined);

    t.end();
  }
);

```
