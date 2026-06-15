import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.returnsArg", (t) => {
  const stub = sinon.stub().returnsArg(0);

  t.equal(
    stub("apple pie", "blueberry pie", "cherry pie"),
    "apple pie",
    "returns the first argument"
  );

  t.throws(
    () => stub(),
    /returnsArg failed: 1 arguments required but only 0 present/,
    "throws when argument not available"
  );

  t.end();
});
