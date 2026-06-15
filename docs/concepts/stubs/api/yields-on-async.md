---
title: stub.yieldsOnAsync
description: Causes the stub to call the first callback it receives with any provided arguments, with an additional parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
---

# `stub.yieldsOnAsync()`

Causes the stub to call the first callback it receives with any provided arguments, with an additional parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context, asynchronously.

<<< ../../../.vitepress/tests/docs/stubs/api/yields-on-async.test.js

## Errors

When the argument at the provided index is `undefined`, or not a function, an `Error` will be thrown.

## See also

- [stub.yields](./yields)
- [stub.yieldsAsync](./yields-async)
- [stub.yieldsOn](./yields-on)
- [stub.yieldsRight](./yields-right)
- [stub.yieldsTo](./yields-to)
- [stub.yieldsToOn](./yields-to-on)
- [stub.yieldsToAsync](./yields-to-async)
- [stub.yieldsToOnAsync](./yields-to-on-async)

## More information

- https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
- https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
- YouTube: ["JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue"](https://www.youtube.com/watch?v=eiC58R16hb8) by Lydia Hallie
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
