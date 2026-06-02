import t from "tap";
import sinon from "sinon";

t.test("stub.callArg invokes callback at specified index", (t) => {
  const stub = sinon.stub();
  const index = 1;

  const callback0 = sinon.fake.returns("Success!");
  const callback1 = sinon.fake.returns("Oh noes!");

  stub(callback0, callback1);

  const result = stub.callArg(index);

  // Verify the right callback was called
  t.notOk(callback0.called, "callback0 should not be called");
  t.ok(callback1.calledOnce, "callback1 should be called once");

  // Verify the return value
  t.same(result, ["Oh noes!"]);

  t.end();
});
