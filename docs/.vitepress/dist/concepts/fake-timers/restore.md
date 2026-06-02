---
url: /concepts/fake-timers/restore.md
description: 'Restores the faked methods, returning time to normal.'
---

# `clock.restore()`

Restore the faked methods.

Call in e.g. `tearDown`.

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
