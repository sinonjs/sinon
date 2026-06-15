import t from "tap";
import sinon from "sinon";

t.test("stub.yieldsToAsync invokes callback asynchronously", async (t) => {
  const clock = sinon.useFakeTimers();

  const stub = sinon.stub().yieldsToAsync("setColor", "blue");

  const car = {
    color: "red",
    setColor: sinon.fake(function (newColor) {
      car.color = newColor;
    })
  };

  stub(car);

  // Verify initial state (callback not yet invoked)
  t.equal(car.color, "red", "color should still be red initially");
  t.notOk(car.setColor.called, "setColor should not be called yet");

  // Advance time to trigger async callback
  await clock.tickAsync(1);

  // Verify callback was invoked asynchronously
  t.ok(car.setColor.calledOnce, "setColor should be called once");
  t.ok(
    car.setColor.calledWith("blue"),
    "setColor should be called with 'blue'"
  );
  t.equal(car.color, "blue", "color should be blue after async callback");

  clock.restore();
  t.end();
});
