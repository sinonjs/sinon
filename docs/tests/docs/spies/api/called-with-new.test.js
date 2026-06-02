import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledWithNew", (t) => {
  const spy = sinon.spy();

  t.notOk(
    spy.calledWithNew("apple pie"),
    "returns false when spy has not been called"
  );

  new spy("apple pie");
  t.ok(
    spy.calledWithNew("apple pie"),
    "returns true when spy was called with new operator"
  );

  t.end();
});
