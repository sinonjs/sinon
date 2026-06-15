import t from "tap";
import sinon from "sinon";

t.test(
  "clock.runMicrotasks flushes process.nextTick without advancing time",
  (t) => {
    const clock = sinon.useFakeTimers({ toFake: ["nextTick"] });

    let called = false;
    process.nextTick(() => {
      called = true;
    });

    t.notOk(called, "nextTick callback should not have run yet");

    clock.runMicrotasks();

    t.ok(called, "nextTick callback should have run");
    t.equal(clock.now, 0, "clock time should not have advanced");

    clock.restore();
    t.end();
  }
);

t.test("clock.runMicrotasks flushes queueMicrotask callbacks", (t) => {
  const clock = sinon.useFakeTimers({ toFake: ["queueMicrotask"] });

  let called = false;
  queueMicrotask(() => {
    called = true;
  });

  clock.runMicrotasks();

  t.ok(called, "queueMicrotask callback should have run");

  clock.restore();
  t.end();
});

t.test("clock.runMicrotasks does not fire setTimeout callbacks", (t) => {
  const clock = sinon.useFakeTimers();

  let timerCalled = false;
  setTimeout(() => {
    timerCalled = true;
  }, 0);

  clock.runMicrotasks();

  t.notOk(timerCalled, "setTimeout callback should not have fired");

  clock.restore();
  t.end();
});
