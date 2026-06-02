---
url: /concepts/spy-call/api/returned.md
description: >-
  Returns `true`, when the spied function returned the provided `value` on this
  call.
---

# `spyCall.returned(value);`

Returns `true`, when the spied function returned the provided `value` on this call.

Uses deep comparison for objects and arrays. Use `spyCall.returned(sinon.match.same(obj))` for strict comparison (see [matchers](/concepts/matchers/)).

```js
import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.returned returns true,
    when spied function returned value on this call`,
  (t) => {
    const pie = "apple pie";
    const f = sinon.fake.returns(pie);

    f();

    const sc = f.firstCall;

    t.ok(sc.returned(pie));

    t.end();
  }
);

```
