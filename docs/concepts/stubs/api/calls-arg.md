---
title: stub.callsArg
description: Causes the stub to call the argument at the provided `index` as a callback function.
---

# `stub.callsArg(index)`

Causes the stub to call the argument at the provided `index` as a callback function.

<<< ../../../.vitepress/tests/docs/stubs/api/calls-arg.test.js

## Errors

When the argument at the provided `index` is not available or is not a function, an `Error` will be thrown.

## See also

- [stub.callsArgAsync](./calls-arg-async)
- [stub.callsArgOn](./calls-arg-on)
- [stub.callsArgOnAsync](./calls-arg-on-async)
- [stub.callsArgOnWith](./calls-arg-on-with)
- [stub.callsArgOnWithAsync](./calls-arg-on-with-async)
- [stub.callsArgWith](./calls-arg-with)
- [stub.callsArgWithAsync](./calls-arg-with-async)
