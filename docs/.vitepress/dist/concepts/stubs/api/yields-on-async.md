---
url: /concepts/stubs/api/yields-on-async.md
description: >-
  Causes the stub to call the first callback it receives with any provided
  arguments, with an additional parameter to pass the
  [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
---

# `stub.yieldsOnAsync()`

Causes the stub to call the first callback it receives with any provided arguments, with an additional parameter to pass the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context, asynchronously.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yieldsOnAsync - basic usage", async (t) => {
  const clock = sinon.useFakeTimers();
  const car = {
    color: "red"
  };
  const stub = sinon.stub().yieldsOnAsync(car);

  function updateColor() {
    this.color = "blue";
  }

  t.equal(car.color, "red", "car color is red initially");

  stub(updateColor);
  t.equal(
    car.color,
    "red",
    "car color is still red immediately after stub call"
  );

  await clock.tickAsync(1);
  t.equal(car.color, "blue", "car color is blue after async callback");

  clock.restore();
  t.end();
});

tap.test("stub.yieldsOnAsync - errors", (t) => {
  const car = {
    color: "red"
  };
  const stub = sinon.stub().yieldsOnAsync(car);

  const pie = "apple pie";

  t.throws(
    () => stub(pie),
    /stub expected to yield, but no callback was passed/,
    "throws when argument is not a function"
  );

  t.end();
});

```

## Errors

When the argument at the provided index is `undefined`, or not a function, an `Error` will be thrown.

## See also

* [stub.yields](./yields)
* [stub.yieldsAsync](./yields-async)
* [stub.yieldsOn](./yields-on)
* [stub.yieldsRight](./yields-right)
* [stub.yieldsTo](./yields-to)
* [stub.yieldsToOn](./yields-to-on)
* [stub.yieldsToAsync](./yields-to-async)
* [stub.yieldsToOnAsync](./yields-to-on-async)

## More information

* https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
* https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
* YouTube: ["JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue"](https://www.youtube.com/watch?v=eiC58R16hb8) by Lydia Hallie
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
