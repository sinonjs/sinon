---
url: /concepts/fake-timers/run-all.md
description: >-
  Runs all pending timers until there are none remaining. Use runAllAsync for
  promise-based callbacks.
---

# `clock.runAll()` / `await clock.runAllAsync()`

This runs all pending timers until there are none remaining. If new timers are added while it is executing they will be run as well.

This makes it easier to run asynchronous tests to completion without worrying about the number of timers they use, or the delays in those timers.

The `runAllAsync()` will also break the event loop, allowing any scheduled promise callbacks to execute *before* running the timers.

```js
import t from "tap";
import sinon from "sinon";

t.test("useFakeTimers with nextTick requires manual flushing", (t) => {
  const clock = sinon.useFakeTimers({
    now: 1483228800000,
    toFake: ["setTimeout", "nextTick"]
  });

  let called = false;

  process.nextTick(function () {
    called = true;
  });

  // nextTick doesn't execute automatically
  t.notOk(called, "callback should not be called yet");

  // Forces nextTick calls to flush synchronously
  clock.runAll();

  // Verify callback was executed
  t.ok(called, "callback should be called after runAll");

  clock.restore();
  t.end();
});

```
