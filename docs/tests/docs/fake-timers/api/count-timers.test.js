import t from "tap";
import sinon from "sinon";

t.test("clock.countTimers returns zero for a fresh clock", (t) => {
  const clock = sinon.useFakeTimers();

  t.equal(clock.countTimers(), 0, "fresh clock should have no pending timers");

  clock.restore();
  t.end();
});

t.test("clock.countTimers counts remaining timers after a tick", (t) => {
  const clock = sinon.useFakeTimers();

  setTimeout(() => {}, 100);
  setTimeout(() => {}, 200);
  setTimeout(() => {}, 300);

  clock.tick(150);

  t.equal(clock.countTimers(), 2, "two timers should remain after 150ms");

  clock.restore();
  t.end();
});

t.test("clock.countTimers includes microtasks such as nextTick", (t) => {
  const clock = sinon.useFakeTimers({ toFake: ["nextTick"] });

  process.nextTick(() => {});

  t.equal(
    clock.countTimers(),
    1,
    "nextTick callback should count as a pending timer"
  );

  clock.restore();
  t.end();
});
