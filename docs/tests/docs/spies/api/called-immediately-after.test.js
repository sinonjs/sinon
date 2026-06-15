import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledImmediatelyAfter", (t) => {
  const fake = sinon.fake();
  const spy = sinon.spy();
  const stub = sinon.stub();

  t.notOk(fake.calledImmediatelyAfter(spy), "returns false before any calls");

  fake();
  spy();
  stub();

  t.notOk(
    fake.calledImmediatelyAfter(spy),
    "fake was not called immediately after spy"
  );

  t.ok(
    spy.calledImmediatelyAfter(fake),
    "spy was called immediately after fake"
  );

  t.notOk(
    stub.calledImmediatelyAfter(fake),
    "stub was not called immediately after fake"
  );

  t.end();
});
