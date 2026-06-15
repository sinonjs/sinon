import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.reset - resetting mutable behavior of stubs", (t) => {
  // The sinon root object is a default sandbox
  const stub = sinon.stub();

  // Observe the default behavior
  t.equal(typeof stub(), "undefined", "stub returns undefined by default");

  // Set some behavior for this stub
  stub.returns("Apple pie");

  // Try it out
  t.equal(stub(), "Apple pie", "stub returns Apple pie");

  // Reset behavior and history of everything created using the default
  // sandbox `sinon`
  sinon.reset();

  // Observe the default behavior
  t.equal(typeof stub(), "undefined", "stub returns undefined after reset");

  t.end();
});
