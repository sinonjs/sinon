---
url: /concepts/stubs/api/resolves.md
description: >-
  Causes the stub to return a
  [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise),
  which resolves to the provided value.
---

# `stub.resolves(value)`

Causes the stub to return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which resolves to the provided value.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.resolves", async (t) => {
  const stub = sinon.stub().resolves("apple pie");

  const result = await stub();

  t.equal(result, "apple pie", "stub resolves with the provided value");

  t.end();
});

```
