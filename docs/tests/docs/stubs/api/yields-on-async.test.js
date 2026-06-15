import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yieldsOnAsync - basic usage", async (t) => {
  const clock = sinon.useFakeTimers();
  const car = {
    color: "red"
  };
  const stub = sinon.stub().yieldsOnAsync(car);

  function updateColor() {
    this.color = "blue";
  }

  t.equal(car.color, "red", "car color is red initially");

  stub(updateColor);
  t.equal(
    car.color,
    "red",
    "car color is still red immediately after stub call"
  );

  await clock.tickAsync(1);
  t.equal(car.color, "blue", "car color is blue after async callback");

  clock.restore();
  t.end();
});

tap.test("stub.yieldsOnAsync - errors", (t) => {
  const car = {
    color: "red"
  };
  const stub = sinon.stub().yieldsOnAsync(car);

  const pie = "apple pie";

  t.throws(
    () => stub(pie),
    /stub expected to yield, but no callback was passed/,
    "throws when argument is not a function"
  );

  t.end();
});
