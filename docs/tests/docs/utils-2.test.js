import t from "tap";
import sinon from "sinon";

t.test("restoreObject restores all methods and returns the object", (t) => {
  const obj = {
    foo: () => {}
  };

  const originalFoo = obj.foo;

  // Wrap method with spy
  sinon.spy(obj, "foo");

  // Verify method is now a spy
  t.ok(obj.foo.restore, "foo should have restore method (is wrapped)");

  // Restore the object
  const result = sinon.restoreObject(obj);

  // Verify restoration
  t.equal(result, obj, "should return the restored object");
  t.notOk(obj.foo.restore, "foo should no longer have restore method");
  t.equal(obj.foo, originalFoo, "foo should be restored to original");

  t.end();
});
