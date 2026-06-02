---
title: stub.callsArgWith
description: Causes the stub to call the argument at the provided `index` as a callback function, with the argument(s) provided.
---

# `stub.callsArgWith(index)`

Causes the stub to call the argument at the provided `index` as a callback function, with the argument(s) provided.

<<< ../../../.vitepress/tests/docs/stubs/api/calls-arg-with.test.js

## Errors

When the argument at the provided `index` is not available or is not a function, an `Error` will be thrown.

## See also

- [stub.callsArg](./calls-arg)
- [stub.callsArgAsync](./calls-arg-async)
- [stub.callsArgOn](./calls-arg-on)
- [stub.callsArgOnAsync](./calls-arg-on-async)
- [stub.callsArgOnWith](./calls-arg-on-with)
- [stub.callsArgOnWithAsync](./calls-arg-on-with-async)
- [stub.callsArgWithAsync](./calls-arg-with-async)
