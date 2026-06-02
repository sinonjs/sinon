---
title: assert.alwaysThrew
description: Like above, only required for all calls to the spy.
---

## `assert.alwaysThrew(spy, exception);`

Like above, only required for all calls to the spy.

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] always threw the given exception.

The exception can be a `String` denoting its type, or an actual object.

When only one argument is provided, the assertion passes if `spy` always threw any exception.

```js
import * as sinon from "sinon";
const f1 = sinon.fake();

f1("apple pie");

sinon.assert.alwaysThrew(f1, "TypeError");
// => Uncaught Error [AssertError]: fake did not throw exception

const f2 = sinon.fake.throws(new TypeError("not an apple pie"));

try {
  f2("apple pie");
} catch (err) {
  // not used
}

// Generates no error
sinon.assert.alwaysThrew(f2, "TypeError");
```

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/always-threw.test.js

[fake]: /concepts/fakes/
[spy]: /concepts/spies/
[stub]: /concepts/stubs/
