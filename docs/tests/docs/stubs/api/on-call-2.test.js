import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.onCall with withArgs", (t) => {
  const callback = sinon.stub();
  const FORTY_TWO = 42;
  const UNKNOWN_VALUE = "any unknown value";

  callback
    .withArgs(FORTY_TWO)
    .onFirstCall()
    .returns("Apple pie")
    .onSecondCall()
    .returns("Blueberry pie");

  callback.returns("Raspberry pie");

  t.equal(
    callback(UNKNOWN_VALUE),
    "Raspberry pie",
    "unknown value returns default"
  );

  t.equal(
    callback(FORTY_TWO),
    "Apple pie",
    "first call with 42 returns Apple pie"
  );

  t.equal(
    callback(UNKNOWN_VALUE),
    "Raspberry pie",
    "unknown value returns default"
  );

  t.equal(
    callback(FORTY_TWO),
    "Blueberry pie",
    "second call with 42 returns Blueberry pie"
  );

  t.equal(
    callback(FORTY_TWO),
    "Raspberry pie",
    "third call with 42 falls back to default"
  );

  t.end();
});
