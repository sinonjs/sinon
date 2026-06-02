---
title: stub.returnsArg
description: Causes the stub to return the argument at the provided index.
---

# `stub.returnsArg(index)`

Causes the stub to return the argument at the provided index.

`stub.returnsArg(0);` causes the stub to return the first argument.

If the argument at the provided index is not available, a `TypeError`
will be thrown.

<<< ../../../.vitepress/tests/docs/stubs/api/returns-arg.test.js
