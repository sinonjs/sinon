---
title: stub.yieldTo
description: Invokes callbacks passed as a property name on an object to the stub.
---

# `stub.yieldTo()`

Invokes callbacks passed as a property name on an object to the stub.

Like [`yield`](./yield), `yieldTo` grabs the first matching argument, finds the callback and calls it with the (optional) arguments.

<<< ../../../.vitepress/tests/docs/stubs/api/yield-to.test.js
