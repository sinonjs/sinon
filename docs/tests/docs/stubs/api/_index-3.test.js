import t from "tap";
import sinon from "sinon";

t.test("createStubInstance equivalent to chaining returnsThis", (t) => {
  class MyConstructor {
    foo() {}
  }

  const stub = sinon.createStubInstance(MyConstructor);
  stub.foo.returnsThis();

  const result = stub.foo();

  // Verify it returns this
  t.equal(result, stub, "foo should return this");

  t.end();
});
