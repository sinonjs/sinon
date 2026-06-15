import t from "tap";
import sinon from "sinon";

t.test("stub.yieldsTo invokes callback passed as object property", (t) => {
  const stub = sinon.stub().yieldsTo("hello", "Mickey Mouse");

  const obj = {
    hello: sinon.fake()
  };

  stub(obj);

  // Verify the callback was invoked with the correct arguments
  t.ok(obj.hello.calledOnce, "hello callback should be called once");
  t.ok(
    obj.hello.calledWith("Mickey Mouse"),
    "hello should be called with 'Mickey Mouse'"
  );

  t.end();
});
