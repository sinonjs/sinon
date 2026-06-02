import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.reset - does not change immutable behavior in fakes", (t) => {
  // The sinon root object is a default sandbox
  const fake = sinon.fake.returns("Strawberry pie");

  // Observe the set (immutable) behavior
  t.equal(fake(), "Strawberry pie", "fake returns Strawberry pie");

  sinon.reset();

  // Observe the set (immutable) behavior still exists
  t.equal(
    fake(),
    "Strawberry pie",
    "fake still returns Strawberry pie after reset"
  );

  t.end();
});
