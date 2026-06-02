import t from "tap";
import sinon from "sinon";

t.test("createStubInstance creates stub without invoking constructor", (t) => {
  class MyConstructor {
    method() {
      return "original";
    }
  }

  const stub = sinon.createStubInstance(MyConstructor);

  // Verify it's a stub instance
  t.ok(stub.method.restore, "method should be a stub");
  t.type(stub, MyConstructor, "stub should be instance of MyConstructor");

  t.end();
});
