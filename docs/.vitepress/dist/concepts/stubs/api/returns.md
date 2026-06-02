---
url: /concepts/stubs/api/returns.md
description: Makes the stub return the provided value.
---

# `stub.returns(value)`

Makes the stub return the provided value.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.returns", (t) => {
  const stub = sinon.stub();

  t.equal(stub(), undefined, "stub returns undefined by default");

  stub.returns("Apple pie");

  t.equal(stub(), "Apple pie", "stub returns the provided value");

  t.end();
});

```
