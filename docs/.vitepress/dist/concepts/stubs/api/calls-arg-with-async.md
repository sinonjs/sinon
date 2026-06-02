---
url: /concepts/stubs/api/calls-arg-with-async.md
description: >-
  Causes the stub to call the argument at the provided `index` as a callback
  function, with the argument(s) provided, asynchronously.
---

# `stub.callsArgWithAsync(index)`

Causes the stub to call the argument at the provided `index` as a callback function, with the argument(s) provided, asynchronously.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArgWithAsync - basic usage", async (t) => {
  const clock = sinon.useFakeTimers();
  const index = 0;
  const arg1 = 1;
  const stub = sinon.stub().callsArgWithAsync(index, arg1);

  let value = 0;

  function updateValue(newValue) {
    value = newValue;
  }

  stub(updateValue);
  t.equal(value, 0, "value is 0 immediately");

  await clock.tickAsync(1);
  t.equal(value, 1, "value is 1 after async callback");

  clock.restore();
  t.end();
});

tap.test("stub.callsArgWithAsync - errors", (t) => {
  const index = 0;
  const arg1 = 1;
  const stub = sinon.stub().callsArgWithAsync(index, arg1);

  t.throws(
    () => stub(undefined),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});

```

## Errors

When the argument at the provided `index` is not available or is not a function, an `Error` will be thrown.

## See also

* [stub.callsArg](./calls-arg)
* [stub.callsArgAsync](./calls-arg-async)
* [stub.callsArgOn](./calls-arg-on)
* [stub.callsArgOnAsync](./calls-arg-on-async)
* [stub.callsArgOnWith](./calls-arg-on-with)
* [stub.callsArgOnWithAsync](./calls-arg-on-with-async)
* [stub.callsArgWith](./calls-arg-with)

## More information

* https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
* https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
* YouTube: ["JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue"](https://www.youtube.com/watch?v=eiC58R16hb8) by Lydia Hallie
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
