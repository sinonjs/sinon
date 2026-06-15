---
title: assert.pass
description: Called every time `assertion` passes.
---

# `assert.pass(assertion);`

Called every time `assertion` passes.

Default implementation does nothing.

This method can be overridden by test runners to keep track of how many assertions have passed. Unless you're writing an integration for Sinon into a test runner, you won't need this.

See: https://github.com/sinonjs/sinon/issues/2657 for idea on replacing it

## Example using test framework

<<< ../../../.vitepress/tests/docs/assertions/api/pass.test.js
