import t from "tap";
import sinon from "sinon";

t.test("clock.jump ignores timers not within the jump window", (t) => {
  const clock = sinon.useFakeTimers({ now: 0 });

  let called = false;
  setTimeout(() => {
    called = true;
  }, 1000);

  clock.jump(500);

  t.notOk(called, "timer beyond jump window should not have fired");

  clock.restore();
  t.end();
});

t.test("clock.jump fires timers within the jump window at the destination time", (t) => {
  const clock = sinon.useFakeTimers({ now: 0 });

  let calledAt = null;
  setTimeout(() => {
    calledAt = Date.now();
  }, 1000);

  clock.jump(2000);

  t.equal(calledAt, 2000, "timer should fire and see the jump destination as the current time");

  clock.restore();
  t.end();
});

t.test(
  "clock.jump fires each interval at most once regardless of elapsed time",
  (t) => {
    const clock = sinon.useFakeTimers({ now: 0 });

    let callCount = 0;
    setInterval(() => {
      callCount++;
    }, 100);

    // A plain tick(1500) would fire the interval ~15 times; jump fires it once
    clock.jump(1500);

    t.equal(callCount, 1, "interval should have fired at most once");

    clock.restore();
    t.end();
  }
);

t.test("clock.jump supports human-readable string time arguments", (t) => {
  const clock = sinon.useFakeTimers({ now: 0 });

  let called = false;
  setTimeout(() => {
    called = true;
  }, 100000); // 1 minute 40 seconds

  clock.jump("01:50"); // 1 minute 50 seconds

  t.ok(called, "timer should have fired after string-format jump");

  clock.restore();
  t.end();
});
