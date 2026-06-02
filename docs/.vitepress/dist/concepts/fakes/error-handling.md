---
url: /concepts/fakes/error-handling.md
description: >-
  Fakes validate their usage and throw errors when used incorrectly. Learn about
  common fakes errors and how to fix them.
---

# Error Handling in Fakes

Fakes validate their usage and throw errors when used incorrectly. Understanding these errors helps you use fakes correctly.

## Creating Fakes

### Invalid Argument Type

When creating a fake with `sinon.fake(f)`, if you provide an argument, it must be a function.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.fake throws when passed a non-function argument", (t) => {
  t.throws(
    () => sinon.fake("not a function"),
    /Expected f argument to be a Function/,
    "throws TypeError when argument is not a function"
  );

  t.throws(
    () => sinon.fake(42),
    /Expected f argument to be a Function/,
    "throws TypeError when argument is a number"
  );

  t.throws(
    () => sinon.fake({}),
    /Expected f argument to be a Function/,
    "throws TypeError when argument is an object"
  );

  t.end();
});

```

## Yield Methods

### Missing Callback

Both `fake.yields()` and `fake.yieldsAsync()` expect the last argument to be a callback function. If you call the fake without a callback, it will throw an error.

**For `fake.yields()`:**

```js
import tap from "tap";
import * as sinon from "sinon";
import fs from "fs";

tap.test("fake.yields", (t) => {
  const fake = sinon.fake.yields(null, "file content");
  const anotherFake = sinon.fake();

  sinon.replace(fs, "readFile", fake);

  fs.readFile("somefile", (err, data) => {
    // called with fake values given to yields as arguments
    t.equal(err, null, "callback receives null error");

    t.equal(data, "file content", "callback receives file content");

    // since yields is synchronous, anotherFake is not called yet
    t.notOk(anotherFake.called, "anotherFake not called yet");

    sinon.restore();
    t.end();
  });

  anotherFake();
});

tap.test("fake.yields throws when last argument is not a function", (t) => {
  const fake = sinon.fake.yields("error", "data");

  t.throws(
    () => fake("not a callback"),
    /Expected last argument to be a function/,
    "throws TypeError when last argument is not a function"
  );

  t.end();
});

```

**For `fake.yieldsAsync()`:**

```js
import tap from "tap";
import * as sinon from "sinon";
import fs from "fs";

tap.test("fake.yieldsAsync", (t) => {
  const fake = sinon.fake.yieldsAsync(null, "file content");
  const anotherFake = sinon.fake();

  sinon.replace(fs, "readFile", fake);

  fs.readFile("somefile", (err, data) => {
    // called with fake values given to yields as arguments
    t.equal(err, null, "callback receives null error");

    t.equal(data, "file content", "callback receives file content");

    // since yields is asynchronous, anotherFake is called first
    t.ok(anotherFake.called, "anotherFake was called before callback");

    sinon.restore();
    t.end();
  });

  anotherFake();
});

tap.test(
  "fake.yieldsAsync throws when last argument is not a function",
  (t) => {
    const fake = sinon.fake.yieldsAsync("error", "data");

    t.throws(
      () => fake("not a callback"),
      /Expected last argument to be a function/,
      "throws TypeError when last argument is not a function"
    );

    t.end();
  }
);

```

## Best Practices

1. **Always provide callbacks** - When using `fake.yields()` or `fake.yieldsAsync()`, ensure the fake is called with a callback as the last argument
2. **Type check arguments** - Only pass functions to `sinon.fake()` when wrapping behavior
3. **Use empty fakes** - If you don't need specific behavior, call `sinon.fake()` without arguments to create an empty fake
