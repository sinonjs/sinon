---
title: stub.yieldsAsync
description: Causes the stub to call the first callback it receives with any provided arguments, asynchronously.
---

# `stub.yieldsAsync()`

Causes the stub to call the first callback it receives with any provided arguments, asynchronously.

<<< ../../../.vitepress/tests/docs/stubs/api/yields-async.test.js

If a method accepts more than one callback, you need to use [`yieldsRight`](./yields-right) to call the last callback or [`callsArg`](./calls-arg) to have the stub invoke other callbacks than the first or last one.

## See also

- [stub.yields](./yields)
- [stub.yieldsOn](./yields-on)
- [stub.yieldsOnAsync](./yields-on-async)
- [stub.yieldsRight](./yields-right)
- [stub.yieldsTo](./yields-to)
- [stub.yieldsToOn](./yields-to-on)
- [stub.yieldsToAsync](./yields-to-async)
- [stub.yieldsToOnAsync](./yields-to-on-async)
