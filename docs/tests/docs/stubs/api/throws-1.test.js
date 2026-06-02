import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.throws(message)", (t) => {
  const stub = sinon.stub();

  stub.throws("The pie is a lie");

  t.throws(() => stub(), /The pie is a lie/, "stub throws error with message");

  t.end();
});
