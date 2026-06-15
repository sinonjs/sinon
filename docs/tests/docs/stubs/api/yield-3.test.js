import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yield - returns array of callback return values", (t) => {
  const stub = sinon.stub();

  function callback1(name) {
    return `Hello ${name}`;
  }

  function callback2(name) {
    return `Goodbye ${name}`;
  }

  stub(callback1);
  stub(callback2);

  const result = stub.yield("Mickey Mouse");

  t.same(
    result,
    ["Hello Mickey Mouse", "Goodbye Mickey Mouse"],
    "returns array with all callback return values"
  );

  t.end();
});
