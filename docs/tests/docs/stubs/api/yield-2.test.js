import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yield - error when no callback passed", (t) => {
  const stub = sinon.stub();

  stub("not a function argument");

  t.throws(
    () => stub.yield("Mickey Mouse"),
    /stub cannot yield since no callback was passed/,
    "throws error when no callback was passed"
  );

  t.end();
});
