---
url: /concepts/mocks/api/expects.md
description: >-
  Overrides `obj.method` with an [expectation][expectation] (mock function) and
  returns it.
---

# `mock.expects`

Overrides `obj.method` with an [expectation][expectation] (mock function) and returns it.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("mock.expects - creates expectation that throws when not met", (t) => {
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
    "throws when expectation not met"
  );

  mock.restore();

  t.end();
});

tap.test("mock.expects - verify succeeds when expectation met", (t) => {
  const obj = {
    greet: function (name) {
      return `Hello ${name}`;
    }
  };
  const mock = sinon.mock(obj);
  const expectation = mock.expects("greet");

  obj.greet("Mickey Mouse");

  const result = mock.verify();
  t.ok(result, "verify returns true after calling expected method");

  t.end();
});

```

[expectation]: ./expectations
