import t from "tap";
import sinon from "sinon";

t.test("createSandbox merges in default configuration", (t) => {
  const sandbox = sinon.createSandbox({
    injectInto: null,
    properties: ["spy", "stub", "mock"],
    useFakeTimers: false
  });

  // Verify the configuration is applied
  t.ok(sandbox.spy, "sandbox should have spy");
  t.ok(sandbox.stub, "sandbox should have stub");
  t.ok(sandbox.mock, "sandbox should have mock");
  t.notOk(
    sandbox.clock,
    "sandbox should not have clock when useFakeTimers is false"
  );

  sandbox.restore();
  t.end();
});
