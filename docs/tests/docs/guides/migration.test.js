// Source: docs/guides/migration.md
import t from "tap";
import sinon from "sinon";

t.test("Date-only fake timers leave the event loop running", async (t) => {
  const nextTick = process.nextTick;
  const immediate = setImmediate;
  const microtask = queueMicrotask;
  const now = new Date("2024-01-01T00:00:00Z");
  const clock = sinon.useFakeTimers({ now, toFake: ["Date"] });

  try {
    t.equal(new Date().toISOString(), "2024-01-01T00:00:00.000Z");
    t.equal(process.nextTick, nextTick);
    t.equal(setImmediate, immediate);
    t.equal(queueMicrotask, microtask);
    await new Promise((resolve) => setImmediate(resolve));
    t.equal(Date.now(), now.getTime());
  } finally {
    clock.restore();
  }
});
