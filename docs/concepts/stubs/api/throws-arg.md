---
title: stub.throwsArg
description: Causes the stub to throw the argument at the provided `index.
---

# `stub.throwsArg(index)`

Causes the stub to throw the argument at the provided `index.

`stub.throwsArg(0);` causes the stub to throw the first argument as the
exception.

If the argument at the provided index is not available, a `TypeError` will be
thrown.

<<< ../../../.vitepress/tests/docs/stubs/api/throws-arg.test.js
