---
title: stub.reset
description: Resets both behavior and history of the stub.
---

# `stub.reset()`

Resets both behavior and history of the stub.

<<< ../../../.vitepress/tests/docs/stubs/api/reset.test.js

This is equivalent to calling both [`stub.resetBehavior()`](./reset-behavior) and [`stub.resetHistory()`](./reset-history).

As a convenience, you can apply `stub.reset()` to all stubs using [`sinon.reset()`](/concepts/sandboxes/api/reset).
