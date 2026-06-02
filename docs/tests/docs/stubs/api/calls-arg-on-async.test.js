import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArgOnAsync - basic usage", async (t) => {
  const clock = sinon.useFakeTimers();
  const car = {
    color: "red"
  };
  const stub = sinon.stub().callsArgOnAsync(0, car);

  function updateColor() {
    this.color = "blue";
  }

  t.equal(car.color, "red", "color is red initially");

  stub(updateColor);
  t.equal(car.color, "red", "color is still red immediately after stub call");

  await clock.tickAsync(1);
  t.equal(car.color, "blue", "color is blue after async callback");

  clock.restore();
  t.end();
});

tap.test("stub.callsArgOnAsync - errors", (t) => {
  const car = {
    color: "red"
  };
  const stub = sinon.stub().callsArgOnAsync(0, car);
  const pie = "apple pie";

  t.throws(
    () => stub(pie),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});
