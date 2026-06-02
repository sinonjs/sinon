import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.throws(obj)", (t) => {
  const stub = sinon.stub();

  stub.throws(new RangeError("The pie is a lie"));

  t.throws(() => stub(), RangeError, "stub throws RangeError");

  t.end();
});
