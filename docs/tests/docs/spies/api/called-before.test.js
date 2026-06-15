import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledBefore", (t) => {
  const fake = sinon.fake();
  const spy = sinon.spy();
  const stub = sinon.stub();

  t.notOk(fake.calledBefore(spy), "returns false before any calls");

  fake();
  spy();
  stub();

  t.ok(fake.calledBefore(spy), "fake was called before spy");

  t.ok(spy.calledBefore(stub), "spy was called before stub");

  t.notOk(stub.calledBefore(fake), "stub was not called before fake");

  t.end();
});
