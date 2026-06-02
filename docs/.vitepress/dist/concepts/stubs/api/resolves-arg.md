---
url: /concepts/stubs/api/resolves-arg.md
description: >-
  Causes the stub to return a
  [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise),
  which resolves to the argument at the
---

# `stub.resolvesArg(index)`

Causes the stub to return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which resolves to the argument at the
provided index.

`stub.resolvesArg(0);` causes the stub to return a Promise, which resolves to the first argument.

If the argument at the provided index is not available, a `TypeError` will be thrown.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.resolvesArg", async (t) => {
  const stub = sinon.stub().resolvesArg(1);

  const result = await stub("apple pie", "blueberry pie", "cherry pie");
  t.equal(result, "blueberry pie", "resolves with argument at index 1");

  try {
    await stub("apple pie");
    t.fail("should have rejected");
  } catch (error) {
    t.match(
      error.message,
      /resolvesArg failed: 2 arguments required but only 1 present/,
      "rejects when argument not available"
    );
  }

  t.end();
});

```
