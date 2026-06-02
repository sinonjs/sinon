---
url: /concepts/assertions/api/pass.md
description: Called every time `assertion` passes.
---

# `assert.pass(assertion);`

Called every time `assertion` passes.

Default implementation does nothing.

This method can be overridden by test runners to keep track of how many assertions have passed. Unless you're writing an integration for Sinon into a test runner, you won't need this.

See: https://github.com/sinonjs/sinon/issues/2657 for idea on replacing it

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.pass - always succeeds", (t) => {
  t.doesNotThrow(() => {
    sinon.assert.pass("test assertion");
  }, "pass should not throw");

  t.end();
});

tap.test("assert.pass - can be called without arguments", (t) => {
  t.doesNotThrow(() => {
    sinon.assert.pass();
  }, "pass should work without arguments");

  t.end();
});

```
