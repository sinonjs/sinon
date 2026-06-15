import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callThroughWithNew - basic usage", (t) => {
  const obj = {};
  obj.Sum = function MyConstructor(a, b) {
    this.result = a + b;
  };

  sinon
    .stub(obj, "Sum")
    .callThroughWithNew()
    .withArgs(1, 2)
    .returns({ result: 9000 });

  const sum1 = new obj.Sum(2, 2);
  t.equal(sum1.result, 4, "calls through to original constructor");

  const sum2 = new obj.Sum(1, 2);
  t.equal(sum2.result, 9000, "returns custom value for matching args");

  obj.Sum.restore();

  t.end();
});
