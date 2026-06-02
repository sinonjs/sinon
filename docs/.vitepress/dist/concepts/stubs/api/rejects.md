---
url: /concepts/stubs/api/rejects.md
description: >-
  <!-- TODO: update this after https://github.com/sinonjs/sinon/issues/1679 is
  resolved -->
---

# `stub.rejects()`

Causes the stub to return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which rejects.

## `stub.rejects();`

Causes the stub to return a Promise which rejects with an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). Use this when you don't care about what the value of the error is.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.rejects() - no arguments", async (t) => {
  const stub = sinon.stub().rejects();

  try {
    await stub();
    t.fail("should have rejected");
  } catch (error) {
    t.ok(error instanceof Error, "rejects with an Error");
    t.equal(error.message, "Error", "error message is 'Error'");
  }

  t.end();
});

```

## `stub.rejects(errorName);`

Causes the stub to return a Promise which rejects with an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), with `name` property set to the `errorName` argument and a blank `message` property.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.rejects(errorName)", async (t) => {
  const stub = sinon.stub().rejects("apple pie");

  try {
    await stub();
    t.fail("should have rejected");
  } catch (error) {
    t.equal(error.name, "apple pie", "error name is set");
    t.equal(error.message, "", "error message is blank");
  }

  t.end();
});

```

## `stub.rejects(errorName, errorMessage);`

Causes the stub to return a Promise which rejects with an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), with `name` property set to the provided `errorName` and the `message` property set to the `errorMessage` argument.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.rejects(errorName, errorMessage)", async (t) => {
  const stub = sinon.stub().rejects("some error name", "the pie is a lie");

  try {
    await stub();
    t.fail("should have rejected");
  } catch (error) {
    t.equal(error.name, "some error name", "error name is set");
    t.equal(error.message, "the pie is a lie", "error message is set");
  }

  t.end();
});

```

## `stub.rejects(error);`

When called with an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) instance, it causes the stub to return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which rejects with the provided error instance.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.rejects(error)", async (t) => {
  const pieError = new RangeError("The pie is a lie");
  const stub = sinon.stub().rejects(pieError);

  try {
    await stub();
    t.fail("should have rejected");
  } catch (error) {
    t.equal(error, pieError, "rejects with the exact error instance");
  }

  t.end();
});

```

## Note

When constructing the Promise, sinon uses the `Promise.reject` method.
