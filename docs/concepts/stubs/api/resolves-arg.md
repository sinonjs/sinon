---
title: stub.resolvesArg
description: Causes the stub to return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which resolves to the argument at the
---

# `stub.resolvesArg(index)`

Causes the stub to return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which resolves to the argument at the
provided index.

`stub.resolvesArg(0);` causes the stub to return a Promise, which resolves to the first argument.

If the argument at the provided index is not available, a `TypeError` will be thrown.

<<< ../../../.vitepress/tests/docs/stubs/api/resolves-arg.test.js
