---
url: /concepts/sandboxes/api/verify.md
description: Verifies all mocks created through the sandbox.
---

# `sandbox.verify();`

Verifies all mocks created through the sandbox.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.verify - verifies all mocks", (t) => {
  // The sinon root object is a default sandbox
  const obj = {
    greet: function (name) {
      return `Hello ${name}`;
    }
  };
  const mock = sinon.mock(obj);
  const expectation = mock.expects("greet");

  // verify will throw because of the unmet expectation
  t.throws(
    () => sinon.verify(),
    /Expected greet\('\[...\]'\) once \(never called\)/,
    "throws when expectation not met"
  );

  sinon.restore();

  t.end();
});

```
