---
url: /concepts/stubs/api/calls-arg-async.md
description: >-
  Causes the stub to call the argument at the provided `index` as a callback
  function, asynchronously.
---

# `stub.callsArgAsync(index)`

Causes the stub to call the argument at the provided `index` as a callback function, asynchronously.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArgAsync - basic usage", async (t) => {
  const clock = sinon.useFakeTimers();
  const stub = sinon.stub().callsArgAsync(0);

  let value = 0;

  function updateValue() {
    value = 1;
  }

  stub(updateValue);
  t.equal(value, 0, "value is 0 immediately after stub call");

  await clock.tickAsync(1);
  t.equal(value, 1, "value is 1 after async callback");

  clock.restore();
  t.end();
});

tap.test("stub.callsArgAsync - errors", (t) => {
  const stub = sinon.stub().callsArgAsync(0);
  const pie = "apple pie";

  t.throws(
    () => stub(pie),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});

```

## Errors

When the argument at the provided `index` is `undefined`, or not a function,
an `Error` will be thrown.

## See also

* [stub.callsArg](./calls-arg)
* [stub.callsArgOn](./calls-arg-on)
* [stub.callsArgOnAsync](./calls-arg-on-async)
* [stub.callsArgOnWith](./calls-arg-on-with)
* [stub.callsArgOnWithAsync](./calls-arg-on-with-async)
* [stub.callsArgWith](./calls-arg-with)
* [stub.callsArgWithAsync](./calls-arg-with-async)

## More information

* https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
* https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
* YouTube: ["JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue"](https://www.youtube.com/watch?v=eiC58R16hb8) by Lydia Hallie
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
