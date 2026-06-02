---
title: stub.callsArgAsync
description: Causes the stub to call the argument at the provided `index` as a callback function, asynchronously.
---

# `stub.callsArgAsync(index)`

Causes the stub to call the argument at the provided `index` as a callback function, asynchronously.

<<< ../../../.vitepress/tests/docs/stubs/api/calls-arg-async.test.js

## Errors

When the argument at the provided `index` is `undefined`, or not a function,
an `Error` will be thrown.

## See also

- [stub.callsArg](./calls-arg)
- [stub.callsArgOn](./calls-arg-on)
- [stub.callsArgOnAsync](./calls-arg-on-async)
- [stub.callsArgOnWith](./calls-arg-on-with)
- [stub.callsArgOnWithAsync](./calls-arg-on-with-async)
- [stub.callsArgWith](./calls-arg-with)
- [stub.callsArgWithAsync](./calls-arg-with-async)

## More information

- https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
- https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
- YouTube: ["JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue"](https://www.youtube.com/watch?v=eiC58R16hb8) by Lydia Hallie
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
