---
url: /concepts/stubs/api/with-args.md
description: Stubs the method only for the provided arguments.
---

# `stub.withArgs()`

Stubs the method only for the provided arguments.

This is useful to be more expressive in your assertions, where you can access the spy with the same call. It is also useful to create a stub that can act differently in response to different arguments.

Uses deep comparison for objects and arrays. Use `stub.withArgs(sinon.match.same(obj))` for strict comparison (see [matchers](/concepts/matchers/)).

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.withArgs", (t) => {
  const callback = sinon.stub();
  callback.withArgs(42).returns(1);
  callback.withArgs(1).throws(new Error("apple pie"));

  // No return value, no exception
  t.equal(callback(), undefined, "returns undefined for unmatched arguments");

  t.equal(callback(42), 1, "returns 1 for argument 42");

  t.equal(callback.withArgs(42).callCount, 1, "withArgs(42) was called once");

  try {
    callback(1);
    t.fail("should have thrown");
  } catch (error) {
    t.equal(error.message, "apple pie", "throws error for argument 1");
  }

  t.end();
});

```
