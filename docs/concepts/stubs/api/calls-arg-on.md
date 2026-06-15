---
title: stub.callsArgOn
description: Causes the stub to call the argument at the provided `index` as a callback function, with an additional `object` parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context.
---

# `stub.callsArgOn(index, object)`

Causes the stub to call the argument at the provided `index` as a callback function, with an additional `object` parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context.

<<< ../../../.vitepress/tests/docs/stubs/api/calls-arg-on.test.js

## Errors

When the argument at the provided `index` is not available or is not a function, an `Error` will be thrown.

## See also

- [stub.callsArg](./calls-arg)
- [stub.callsArgAsync](./calls-arg-async)
- [stub.callsArgOnAsync](./calls-arg-on-async)
- [stub.callsArgOnWith](./calls-arg-on-with)
- [stub.callsArgOnWithAsync](./calls-arg-on-with-async)
- [stub.callsArgWith](./calls-arg-with)
- [stub.callsArgWithAsync](./calls-arg-with-async)
- [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
