---
url: /concepts/sandboxes/api/verify-and-restore.md
description: Verifies all mocks and restores all fakes created through the sandbox.
---

# `sandbox.verifyAndRestore();`

Verifies all mocks and restores all fakes created through the sandbox.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "sandbox.verifyAndRestore - verifies and restores even when verify fails",
  (t) => {
    // The sinon root object is a default sandbox
    const obj = {
      greet: function (name) {
        return `Hello ${name}`;
      }
    };
    const mock = sinon.mock(obj);
    const expectation = mock.expects("greet");

    // Do NOT call greet to have unmet expectation
    // obj.greet("Mickey Mouse");

    // mocked methods have a restore method on them
    t.equal(
      typeof obj.greet.restore,
      "function",
      "mocked method has restore function"
    );

    // verify will throw because of the unmet expectation
    t.throws(
      () => sinon.verifyAndRestore(),
      /Expected greet\('\[...\]'\) once \(never called\)/,
      "throws when expectation not met"
    );

    // but the restore part will still be performed
    // the original greet method has been restored
    t.equal(
      typeof obj.greet.restore,
      "undefined",
      "method restored even though verify failed"
    );

    t.end();
  }
);

```
