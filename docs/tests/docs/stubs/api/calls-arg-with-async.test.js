import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArgWithAsync - basic usage", async (t) => {
  const clock = sinon.useFakeTimers();
  const index = 0;
  const arg1 = 1;
  const stub = sinon.stub().callsArgWithAsync(index, arg1);

  let value = 0;

  function updateValue(newValue) {
    value = newValue;
  }

  stub(updateValue);
  t.equal(value, 0, "value is 0 immediately");

  await clock.tickAsync(1);
  t.equal(value, 1, "value is 1 after async callback");

  clock.restore();
  t.end();
});

tap.test("stub.callsArgWithAsync - errors", (t) => {
  const index = 0;
  const arg1 = 1;
  const stub = sinon.stub().callsArgWithAsync(index, arg1);

  t.throws(
    () => stub(undefined),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});
