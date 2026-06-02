import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.restore - restores all fakes, spies and stubs", (t) => {
  // The sinon root object is a default sandbox
  const obj = {
    one: "1",
    two: "2",
    three: "3"
  };

  sinon.replace(obj, "one", "apple");
  sinon.replace(obj, "two", "banana");
  sinon.replace(obj, "three", "cherry");

  t.same(
    obj,
    { one: "apple", two: "banana", three: "cherry" },
    "properties replaced"
  );

  sinon.restore();
  t.same(obj, { one: "1", two: "2", three: "3" }, "properties restored");

  t.end();
});
