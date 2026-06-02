---
url: /concepts/mocks/api/verify.md
description: Verifies all expectations on the mock and restores all mocked methods.
---

# `mock.verify`

Verifies all expectations on the mock and restores all mocked methods.

If any expectation is not satisfied, an exception is thrown.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("mock.verify - verifies and restores when expectations met", (t) => {
  const obj = {
    greet: function (name) {
      return `Hello ${name}`;
    }
  };
  const mock = sinon.mock(obj);
  const expectation = mock.expects("greet");

  obj.greet("Mickey Mouse");

  // mocked methods have a restore method on them
  t.equal(
    typeof obj.greet.restore,
    "function",
    "mocked method has restore function"
  );

  const result = mock.verify();
  t.ok(result, "verify returns true when expectations met");

  // the original greet method has been restored
  t.equal(
    typeof obj.greet.restore,
    "undefined",
    "restored method no longer has restore function"
  );

  t.end();
});

```

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("mock.verify - throws when expectations not met", (t) => {
  const obj = {
    greet: function (name) {
      return `Hello ${name}`;
    }
  };
  const mock = sinon.mock(obj);
  const expectation = mock.expects("greet");

  t.throws(
    () => mock.verify(),
    /Expected greet\('\[...\]'\) once \(never called\)/,
    "throws when expectation not satisfied"
  );

  mock.restore();

  t.end();
});

```
