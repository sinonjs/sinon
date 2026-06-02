import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.throws(function)", (t) => {
  const stub = sinon.stub();

  stub.throws(function () {
    return new SyntaxError("The pie is a lie");
  });

  t.throws(() => stub(), SyntaxError, "stub throws SyntaxError from function");

  t.end();
});
