import t from "tap";
import sinon from "sinon";

t.test("clock.tick advances time and fires timers", (t) => {
  const clock = sinon.useFakeTimers();

  let callCount = 0;

  setTimeout(() => {
    callCount++;
  }, 100);

  setTimeout(() => {
    callCount++;
  }, 200);

  // Before ticking, callbacks should not have fired
  t.equal(callCount, 0, "callbacks should not have fired yet");

  // Tick past the first timeout
  clock.tick(100);

  t.equal(callCount, 1, "first callback should have fired");

  // Tick past the second timeout
  clock.tick(100);

  t.equal(callCount, 2, "second callback should have fired");

  clock.restore();
  t.end();
});

t.test("clock.tick accepts human-readable strings", (t) => {
  const clock = sinon.useFakeTimers();

  let called = false;

  setTimeout(() => {
    called = true;
  }, 5000);

  // "00:00:05" = 5 seconds
  clock.tick("00:00:05");

  t.ok(called, "callback should have fired after 5 seconds");

  clock.restore();
  t.end();
});

t.test(
  "clock.tickAsync allows promise callbacks to execute first",
  async (t) => {
    const clock = sinon.useFakeTimers();

    let asyncCalled = false;
    let syncResult = "";

    setTimeout(() => {
      asyncCalled = true;
    }, 100);

    // tickAsync breaks the event loop, allowing promises to resolve
    await clock.tickAsync(100);

    t.ok(asyncCalled, "async callback should have fired");

    clock.restore();
    t.end();
  }
);
