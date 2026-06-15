---
title: stub.yieldsToOnAsync
description: Causes the spy to invoke a callback passed as a property of an object to the spy.
---

# `stub.yieldsToOnAsync(property, context, [arg1, arg2, ...])`

Causes the spy to invoke a callback passed as a property of an object to the spy.

`yieldsToOnAsync` grabs the first matching argument, finds the callback and calls it, passing the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context and any (optional) arguments, asynchronously.

<<< ../../../.vitepress/tests/docs/stubs/api/yields-to-on-async.test.js

## See also

- [stub.yields](./yields)
- [stub.yieldsAsync](./yields-async)
- [stub.yieldsOn](./yields-on)
- [stub.yieldsOnAsync](./yields-on-async)
- [stub.yieldsRight](./yields-right)
- [stub.yieldsTo](./yields-to)
- [stub.yieldsToOn](./yields-to-on)
- [stub.yieldsToAsync](./yields-to-async)

## More information

- https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
- https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
- YouTube: ["JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue"](https://www.youtube.com/watch?v=eiC58R16hb8) by Lydia Hallie
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
