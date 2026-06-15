import t from "tap";
import sinon from "sinon";

t.test(
  "clock.runToLast runs all pending timers and returns the time of the last",
  (t) => {
    const clock = sinon.useFakeTimers();

    const calls = [];
    setTimeout(() => calls.push("first"), 10);
    setTimeout(() => calls.push("second"), 50);

    const time = clock.runToLast();

    t.same(calls, ["first", "second"], "all timers should have fired in order");
    t.equal(time, 50, "should return the time of the last timer");

    clock.restore();
    t.end();
  }
);

t.test(
  "clock.runToLast does not run timers added beyond the last scheduled time",
  (t) => {
    const clock = sinon.useFakeTimers();

    let laterCalled = false;
    setTimeout(() => {
      // This new timer (10ms + 50ms = 60ms) is beyond the original last timer (10ms)
      setTimeout(() => {
        laterCalled = true;
      }, 50);
    }, 10);

    clock.runToLast();

    t.notOk(
      laterCalled,
      "timer added beyond the last scheduled time should not run"
    );

    clock.restore();
    t.end();
  }
);

t.test(
  "clock.runToLastAsync allows promise callbacks to execute before timers",
  async (t) => {
    const clock = sinon.useFakeTimers();

    const order = [];
    Promise.resolve().then(() => order.push("microtask"));
    setTimeout(() => order.push("timer"), 100);

    await clock.runToLastAsync();

    t.ok(
      order.indexOf("microtask") < order.indexOf("timer"),
      "microtask should have run before the timer"
    );

    clock.restore();
    t.end();
  }
);
