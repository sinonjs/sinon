import t from "tap";
import sinon from "sinon";

t.test(
  "clock.setSystemTime changes the visible time without affecting timer scheduling",
  (t) => {
    const stub = sinon.stub();
    const clock = sinon.useFakeTimers();

    clock.setTimeout(stub, 5000);
    clock.tick(1000);
    // Shift the displayed time forward by 1000ms — the timer schedule is unaffected
    clock.setSystemTime(new clock.Date().getTime() + 1000);
    clock.tick(3990);
    t.equal(stub.callCount, 0, "timer should not have fired yet");

    clock.tick(20);
    t.equal(stub.callCount, 1, "timer should fire after the remaining real ticks");

    clock.restore();
    t.end();
  }
);

t.test("clock.setSystemTime accepts a numeric timestamp", (t) => {
  const clock = sinon.useFakeTimers();

  clock.setSystemTime(5000);

  t.equal(Date.now(), 5000, "Date.now() should reflect the new system time");

  clock.restore();
  t.end();
});

t.test("clock.setSystemTime accepts a Date object", (t) => {
  const clock = sinon.useFakeTimers();

  const target = new Date("2025-01-01T00:00:00Z");
  clock.setSystemTime(target);

  t.equal(
    Date.now(),
    target.getTime(),
    "Date.now() should match the provided Date"
  );

  clock.restore();
  t.end();
});
