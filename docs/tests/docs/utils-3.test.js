import t from "tap";
import sinon from "sinon";

t.test("restoreObject is a no-op when object has no restorable methods", (t) => {
  const emptyObj = {};

  t.doesNotThrow(
    () => sinon.restoreObject(emptyObj),
    "should be a no-op when object has no restorable methods"
  );

  t.end();
});
