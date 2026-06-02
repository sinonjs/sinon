---
url: /concepts/stubs/api/throws.md
description: Causes the stub to throw an Error.
---

# `stub.throws()`

Causes the stub to throw an Error.

## `stub.throws(message)`

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.throws(message)", (t) => {
  const stub = sinon.stub();

  stub.throws("The pie is a lie");

  t.throws(() => stub(), /The pie is a lie/, "stub throws error with message");

  t.end();
});

```

## `stub.throws("name" [, "optional message"])`

Causes the stub to throw an exception with the `name` property set to the provided string. The message parameter is optional and will set the `message` property of the exception.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.throws(name, message)", (t) => {
  const stub = sinon.stub();

  stub.throws("PieError", "The pie is a lie");

  try {
    stub();
    t.fail("should have thrown");
  } catch (error) {
    t.equal(error.name, "PieError", "error name is set");
    t.equal(error.message, "The pie is a lie", "error message is set");
  }

  t.end();
});

```

## `stub.throws(obj)`

Causes the stub to throw the provided error object.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.throws(obj)", (t) => {
  const stub = sinon.stub();

  stub.throws(new RangeError("The pie is a lie"));

  t.throws(() => stub(), RangeError, "stub throws RangeError");

  t.end();
});

```

## `stub.throws(function() { return new Error(); })`

Causes the stub to throw the exception returned by the function.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.throws(function)", (t) => {
  const stub = sinon.stub();

  stub.throws(function () {
    return new SyntaxError("The pie is a lie");
  });

  t.throws(() => stub(), SyntaxError, "stub throws SyntaxError from function");

  t.end();
});

```
