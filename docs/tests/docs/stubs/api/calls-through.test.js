import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsThrough", (t) => {
  const obj = {};
  obj.sum = function sum(a, b) {
    return a + b;
  };

  sinon
    .stub(obj, "sum")
    .withArgs(2, 2)
    .callsFake(function foo() {
      return "bar";
    });

  obj.sum.callThrough();

  t.equal(
    obj.sum(2, 2),
    "bar",
    "stub returns fake value for matched arguments"
  );
  t.equal(
    obj.sum(1, 2),
    3,
    "stub calls through to original for unmatched arguments"
  );

  sinon.restore();
  t.end();
});
