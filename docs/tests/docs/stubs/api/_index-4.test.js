import t from "tap";
import sinon from "sinon";

t.test("createStubInstance with value overrides", (t) => {
  class MyConstructor {
    foo() {}
  }

  const stub = sinon.createStubInstance(MyConstructor, {
    foo: 3
  });

  const result = stub.foo();

  // Verify the value override works
  t.equal(result, 3, "foo should return 3");

  t.end();
});
