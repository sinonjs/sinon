import t from "tap";
import sinon from "sinon";

t.test("createStubInstance with stub overrides", (t) => {
  class MyConstructor {
    foo() {}
  }

  const stub = sinon.createStubInstance(MyConstructor, {
    foo: sinon.stub().returnsThis()
  });

  const result = stub.foo();

  // Verify the override works
  t.equal(result, stub, "foo should return this");

  t.end();
});
