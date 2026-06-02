---
url: /concepts/spy-call/api/callback.md
description: This property is a convenience for a call's callback.
---

# `spyCall.callback`

This property is a convenience for a call's callback.

When the last argument in a call is a `Function`, then `callback` will reference that. Otherwise it will be `undefined`.

```js
import t from "tap";
import sinon from "sinon";

t.test(`spyCall.callback contains the callback of the call`, (t) => {
  const f = sinon.fake();
  const callback = function () {};

  f(1, 2, 3, callback);

  t.equal(callback, f.lastCall.callback);

  f(4, 5, 6);
  t.equal(undefined, f.lastCall.callback);

  t.end();
});

```
