---
url: /concepts/stubs/api/yields-to-async.md
description: >-
  Causes the spy to invoke a callback passed as a property of an object to the
  spy.
---

# `stub.yieldsToAsync()`

Causes the spy to invoke a callback passed as a property of an object to the spy.

`yieldsToAsync` grabs the first matching argument, finds the callback and calls it with the (optional) arguments, asynchronously.

```js
import t from "tap";
import sinon from "sinon";

t.test("stub.yieldsToAsync invokes callback asynchronously", async (t) => {
  const clock = sinon.useFakeTimers();

  const stub = sinon.stub().yieldsToAsync("setColor", "blue");

  const car = {
    color: "red",
    setColor: sinon.fake(function (newColor) {
      car.color = newColor;
    })
  };

  stub(car);

  // Verify initial state (callback not yet invoked)
  t.equal(car.color, "red", "color should still be red initially");
  t.notOk(car.setColor.called, "setColor should not be called yet");

  // Advance time to trigger async callback
  await clock.tickAsync(1);

  // Verify callback was invoked asynchronously
  t.ok(car.setColor.calledOnce, "setColor should be called once");
  t.ok(
    car.setColor.calledWith("blue"),
    "setColor should be called with 'blue'"
  );
  t.equal(car.color, "blue", "color should be blue after async callback");

  clock.restore();
  t.end();
});

```

## See also

* [stub.yields](./yields)
* [stub.yieldsAsync](./yields-async)
* [stub.yieldsOn](./yields-on)
* [stub.yieldsOnAsync](./yields-on-async)
* [stub.yieldsRight](./yields-right)
* [stub.yieldsTo](./yields-to)
* [stub.yieldsToOn](./yields-to-on)
* [stub.yieldsToOnAsync](./yields-to-on-async)

## More information

* https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
* https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
* YouTube: ["JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue"](https://www.youtube.com/watch?v=eiC58R16hb8) by Lydia Hallie
