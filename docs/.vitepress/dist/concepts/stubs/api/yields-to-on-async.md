---
url: /concepts/stubs/api/yields-to-on-async.md
description: >-
  Causes the spy to invoke a callback passed as a property of an object to the
  spy.
---

# `stub.yieldsToOnAsync(property, context, [arg1, arg2, ...])`

Causes the spy to invoke a callback passed as a property of an object to the spy.

`yieldsToOnAsync` grabs the first matching argument, finds the callback and calls it, passing the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) context and any (optional) arguments, asynchronously.

```js
import t from "tap";
import sinon from "sinon";

t.test(
  "stub.yieldsToOnAsync invokes callback asynchronously with context and args",
  async (t) => {
    const clock = sinon.useFakeTimers();

    const obj = {
      setItem: sinon.fake(function (newItem) {
        this.item = newItem;
      })
    };
    const obj2 = {
      item: "Apple Pie"
    };

    const stub = sinon
      .stub()
      .yieldsToOnAsync("setItem", obj2, "Sweet potato pie");

    stub(obj);

    // Verify initial state (callback not yet invoked)
    t.notOk(obj.setItem.called, "setItem should not be called yet");
    t.equal(
      obj2.item,
      "Apple Pie",
      "item should still be 'Apple Pie' initially"
    );

    // Advance time to trigger async callback
    await clock.tickAsync(1);

    // Verify callback was invoked asynchronously with correct context and arguments
    t.ok(obj.setItem.calledOnce, "setItem should be called once");
    t.ok(
      obj.setItem.calledOn(obj2),
      "setItem should be called with obj2 as this context"
    );
    t.ok(
      obj.setItem.calledWith("Sweet potato pie"),
      "setItem should be called with 'Sweet potato pie'"
    );
    t.equal(
      obj2.item,
      "Sweet potato pie",
      "item should be updated to 'Sweet potato pie'"
    );

    clock.restore();
    t.end();
  }
);

```

## See also

* [stub.yields](./yields)
* [stub.yieldsAsync](./yields-async)
* [stub.yieldsOn](./yields-on)
* [stub.yieldsOnAsync](./yields-on-async)
* [stub.yieldsRight](./yields-right)
* [stub.yieldsTo](./yields-to)
* [stub.yieldsToOn](./yields-to-on)
* [stub.yieldsToAsync](./yields-to-async)

## More information

* https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
* https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
* YouTube: ["JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue"](https://www.youtube.com/watch?v=eiC58R16hb8) by Lydia Hallie
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
