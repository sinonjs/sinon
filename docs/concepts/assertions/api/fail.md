---
title: assert.fail
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

<!-- TODO: create example of overriding exception type -->
<!-- TODO: create example of overriding fail method -->

If the test framework looks for assertion errors by checking for a specific exception, you can override the kind of exception thrown. If that does not fit with your testing framework of choice, override the `fail` method to do the right thing.

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/fail.test.js
