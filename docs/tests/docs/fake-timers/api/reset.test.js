import t from "tap";
import sinon from "sinon";

t.test(
  "clock.reset empties the queue and returns to the install time",
  (t) => {
    const stub = sinon.stub();
    const clock = sinon.useFakeTimers();

    clock.setSystemTime(1000);
    setTimeout(stub);
    clock.reset();
    clock.tick(0);

    t.notOk(stub.called, "callback queued before reset should not fire");
    t.equal(Date.now(), 0, "clock should reset to initial time");

    clock.restore();
    t.end();
  }
);

t.test("clock.reset returns to the timestamp the clock was installed with", (t) => {
  const clock = sinon.useFakeTimers({ now: 10000 });

  clock.tick(5000);
  t.equal(clock.now, 15000, "clock should have advanced");

  clock.reset();

  t.equal(clock.now, 10000, "clock should return to install time");

  clock.restore();
  t.end();
});
