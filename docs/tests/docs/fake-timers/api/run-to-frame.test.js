import t from "tap";
import sinon from "sinon";

t.test("clock.runToFrame advances the clock to successive 16ms boundaries", (t) => {
  const clock = sinon.useFakeTimers();

  clock.runToFrame();
  t.equal(clock.now, 16, "clock should be at 16ms after first frame");

  clock.tick(3); // now at 19ms
  clock.runToFrame();
  t.equal(clock.now, 32, "clock should be at 32ms after second frame");

  clock.restore();
  t.end();
});

t.test("clock.runToFrame fires timers scheduled within the frame", (t) => {
  const clock = sinon.useFakeTimers();

  let called = false;
  setTimeout(() => {
    called = true;
  }, 16);

  clock.runToFrame();

  t.ok(called, "timer scheduled at 16ms should have fired");

  clock.restore();
  t.end();
});
