import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.onFirstCall", (t) => {
  const callback = sinon.stub();

  callback.onFirstCall().returns("Apple pie");
  callback.returns("Raspberry pie");

  t.equal(callback(), "Apple pie", "first call returns Apple pie");

  t.equal(callback(), "Raspberry pie", "second call returns Raspberry pie");
  t.equal(
    callback(),
    "Raspberry pie",
    "all following calls return Raspberry pie"
  );

  t.end();
});
