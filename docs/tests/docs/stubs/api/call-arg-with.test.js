import t from "tap";
import sinon from "sinon";

t.test("stub.callArgWith invokes callback at index with arguments", (t) => {
  const stub = sinon.stub();
  const index = 1;

  const callback0 = sinon.fake.returns("Hi Joe");
  const callback1 = sinon.fake.returns("Hey Joe");

  stub(callback0, callback1);

  const result = stub.callArgWith(index, "Joe");

  // Verify the right callback was called with correct arguments
  t.notOk(callback0.called, "callback0 should not be called");
  t.ok(callback1.calledOnce, "callback1 should be called once");
  t.ok(callback1.calledWith("Joe"), "callback1 should be called with 'Joe'");

  // Verify the return value
  t.same(result, ["Hey Joe"]);

  t.end();
});
