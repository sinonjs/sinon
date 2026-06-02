import t from "tap";
import sinon from "sinon";

t.test("stub.yieldsToOn invokes callback with specified this context", (t) => {
  const obj = {
    hello: sinon.fake()
  };
  const obj2 = {
    item: "Apple Pie"
  };

  const stub = sinon.stub().yieldsToOn("hello", obj2);

  stub(obj);

  // Verify the callback was invoked with correct context
  t.ok(obj.hello.calledOnce, "hello callback should be called once");
  t.ok(
    obj.hello.calledOn(obj2),
    "hello should be called with obj2 as this context"
  );
  t.equal(obj.hello.firstCall.thisValue, obj2, "this should be obj2");

  t.end();
});
