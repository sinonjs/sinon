import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.onCall - basic usage", (t) => {
  const callback = sinon.stub();

  callback.onCall(0).returns("Apple pie");
  callback.onCall(1).returns("Blueberry pie");
  callback.returns("Raspberry pie");

  t.equal(callback(), "Apple pie", "first call returns Apple pie");

  t.equal(callback(), "Blueberry pie", "second call returns Blueberry pie");

  t.equal(callback(), "Raspberry pie", "third call returns Raspberry pie");
  t.equal(
    callback(),
    "Raspberry pie",
    "all following calls return Raspberry pie"
  );

  t.end();
});
