import t from "tap";
import sinon from "sinon";

t.test("clock.next advances to the next scheduled timer", (t) => {
  const clock = sinon.useFakeTimers();

  let firstCalled = false;
  let secondCalled = false;

  setTimeout(() => {
    firstCalled = true;
  }, 10);

  setTimeout(() => {
    secondCalled = true;
  }, 20);

  // Advance to first timer
  clock.next();

  t.ok(firstCalled, "first callback should have fired");
  t.notOk(secondCalled, "second callback should not have fired yet");

  // Advance to second timer
  clock.next();

  t.ok(secondCalled, "second callback should have fired");

  clock.restore();
  t.end();
});

t.test("clock.nextAsync with promises", async (t) => {
  const clock = sinon.useFakeTimers();

  let called = false;

  setTimeout(() => {
    called = true;
  }, 10);

  // nextAsync breaks the event loop first
  await clock.nextAsync();

  t.ok(called, "callback should have fired");

  clock.restore();
  t.end();
});
