import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.resetHistory", (t) => {
  const stub = sinon.stub();

  t.notOk(stub.called, "stub.called is false initially");

  stub();

  t.ok(stub.called, "stub.called is true after call");

  stub.resetHistory();

  t.notOk(stub.called, "stub.called is false after resetHistory");

  t.end();
});
