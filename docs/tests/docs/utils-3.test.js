import t from "tap";
import sinon from "sinon";

t.test("restoreObject throws when object has no restorable methods", (t) => {
  const emptyObj = {};

  // Verify it throws an error
  t.throws(
    () => sinon.restoreObject(emptyObj),
    /no methods/i,
    "should throw error about no methods to restore"
  );

  t.end();
});
