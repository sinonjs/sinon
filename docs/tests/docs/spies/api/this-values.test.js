import t from "tap";
import sinon from "sinon";

t.test("spy.thisValues contains this objects from all calls", (t) => {
  const spy = sinon.spy();
  const object = { apple: "pie" };

  // Call with specific this value
  spy.call(object, "hello");

  // Verify thisValues array
  t.same(spy.thisValues, [object], "thisValues should contain the object");
  t.equal(
    spy.thisValues[0],
    object,
    "thisValues[0] should be the exact same object"
  );

  t.end();
});
