import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArgAsync - basic usage", async (t) => {
  const clock = sinon.useFakeTimers();
  const stub = sinon.stub().callsArgAsync(0);

  let value = 0;

  function updateValue() {
    value = 1;
  }

  stub(updateValue);
  t.equal(value, 0, "value is 0 immediately after stub call");

  await clock.tickAsync(1);
  t.equal(value, 1, "value is 1 after async callback");

  clock.restore();
  t.end();
});

tap.test("stub.callsArgAsync - errors", (t) => {
  const stub = sinon.stub().callsArgAsync(0);
  const pie = "apple pie";

  t.throws(
    () => stub(pie),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});
