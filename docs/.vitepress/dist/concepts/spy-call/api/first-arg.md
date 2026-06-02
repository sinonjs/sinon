---
url: /concepts/spy-call/api/first-arg.md
description: This property contains a reference to the first argument of the call.
---

# `spyCall.firstArg`

This property contains a reference to the first argument of the call.

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.firstArg contains a reference
    to the first argument of the call`,
  (t) => {
    const f = sinon.fake();

    f("apple pie", "banana pie");

    t.equal(f.lastCall.firstArg, "apple pie");

    f();
    t.equal(f.lastCall.firstArg, undefined);

    t.end();
  }
);

```
