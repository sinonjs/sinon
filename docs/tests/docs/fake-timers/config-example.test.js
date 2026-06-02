import t from "tap";
import sinon from "sinon";

t.test("useFakeTimers with config.now and config.loopLimit", (t) => {
  // Start at a specific time (January 1st 2017) with a lower loop limit
  const clock = sinon.useFakeTimers({
    now: 1483228800000,
    loopLimit: 10
  });

  // Verify the clock started at the specified time
  t.equal(Date.now(), 1483228800000, "Date.now() should match config.now");

  // Schedule multiple timeouts
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {}, i * 100);
  }

  // All timers run within the loop limit
  clock.runAll();
  t.pass("timers executed within loopLimit");

  clock.restore();
  t.end();
});
