import t from "tap";
import sinon from "sinon";

t.test("createStubInstance value override equivalent to returns", (t) => {
  class MyConstructor {
    foo() {}
  }

  const stub = sinon.createStubInstance(MyConstructor);
  stub.foo.returns(3);

  const result = stub.foo();

  // Verify it returns the value
  t.equal(result, 3, "foo should return 3");

  t.end();
});
