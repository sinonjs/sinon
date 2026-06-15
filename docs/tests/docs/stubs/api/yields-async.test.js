import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yieldsAsync - basic usage", async (t) => {
  const clock = sinon.useFakeTimers();
  const stub = sinon.stub().yieldsAsync();

  let value = 0;

  function updateValue() {
    value = 1;
  }

  stub(updateValue);
  t.equal(value, 0, "value is 0 immediately");

  await clock.tickAsync(1);
  t.equal(value, 1, "value is 1 after async callback");

  clock.restore();
  t.end();
});
