import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.onThirdCall", (t) => {
  const callback = sinon.stub();

  callback.onThirdCall().returns("Apple pie");
  callback.returns("Raspberry pie");

  t.equal(callback(), "Raspberry pie", "first call returns Raspberry pie");

  t.equal(callback(), "Raspberry pie", "second call returns Raspberry pie");

  t.equal(callback(), "Apple pie", "third call returns Apple pie");
  t.equal(
    callback(),
    "Raspberry pie",
    "all following calls return Raspberry pie"
  );

  t.end();
});
