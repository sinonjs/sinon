import t from "tap";
import sinon from "sinon";

t.test("createSandbox available properties list", (t) => {
  const availableProperties = [
    "spy",
    "stub",
    "mock",
    "createStubInstance",
    "fake",
    "replace",
    "replaceSetter",
    "replaceGetter",
    "clock",
    "match"
  ];

  // Create sandbox with all properties
  const sandbox = sinon.createSandbox({
    properties: availableProperties,
    useFakeTimers: true
  });

  // Verify key properties exist
  t.ok(sandbox.spy, "sandbox should have spy");
  t.ok(sandbox.stub, "sandbox should have stub");
  t.ok(sandbox.mock, "sandbox should have mock");
  t.ok(sandbox.fake, "sandbox should have fake");
  t.ok(sandbox.clock, "sandbox should have clock");

  sandbox.restore();
  t.end();
});
