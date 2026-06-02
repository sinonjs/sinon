import t from "tap";
import sinon from "sinon";

t.test(
  "useFakeTimers with shouldAdvanceTime runs timers automatically",
  async (t) => {
    const clock = sinon.useFakeTimers({
      now: 1483228800000,
      shouldAdvanceTime: true
    });

    const immediate = sinon.fake();
    const timeout1 = sinon.fake();
    const timeout2 = sinon.fake();

    setImmediate(immediate);

    setTimeout(timeout1, 15);

    setTimeout(timeout2, 35);

    // Wait for auto-advancement to trigger timers
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Verify all callbacks were executed
    t.ok(immediate.calledOnce, "setImmediate callback should be called");
    t.ok(timeout1.calledOnce, "first setTimeout callback should be called");
    t.ok(timeout2.calledOnce, "second setTimeout callback should be called");

    clock.restore();
    t.end();
  }
);
