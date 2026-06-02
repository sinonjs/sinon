---
url: /concepts/assertions/api/fail.md
description: This convenience method can cause a test library to fail a test.
---

# `assert.fail(message)`

This convenience method can cause a test library to fail a test.

Every assertion fails by calling this method.

```js
import * as sinon from "sinon";
const msg = "Apple Pie";

sinon.assert.fail(msg);
// => Uncaught Error [AssertError]: Apple Pie
```

By default it throws an error of type `sinon.assert.failException`.

If the test framework looks for assertion errors by checking for a specific exception, you can override the kind of exception thrown. If that does not fit with your testing framework of choice, override the `fail` method to do the right thing.

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.fail - throws with message", (t) => {
  t.throws(
    () => sinon.assert.fail("custom failure message"),
    /custom failure message/,
    "fail should throw with provided message"
  );

  t.end();
});

tap.test("assert.fail - throws AssertError", (t) => {
  try {
    sinon.assert.fail("test");
    t.fail("should have thrown");
  } catch (e) {
    t.equal(e.name, "AssertError", "error should be AssertError");
  }

  t.end();
});

```
