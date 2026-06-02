---
url: /concepts/stubs/api/returns-arg.md
description: Causes the stub to return the argument at the provided index.
---

# `stub.returnsArg(index)`

Causes the stub to return the argument at the provided index.

`stub.returnsArg(0);` causes the stub to return the first argument.

If the argument at the provided index is not available, a `TypeError`
will be thrown.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.returnsArg", (t) => {
  const stub = sinon.stub().returnsArg(0);

  t.equal(
    stub("apple pie", "blueberry pie", "cherry pie"),
    "apple pie",
    "returns the first argument"
  );

  t.throws(
    () => stub(),
    /returnsArg failed: 1 arguments required but only 0 present/,
    "throws when argument not available"
  );

  t.end();
});

```
