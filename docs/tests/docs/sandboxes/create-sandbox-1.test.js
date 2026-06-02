import t from "tap";
import sinon from "sinon";

t.test("createSandbox with empty config uses defaults", (t) => {
  const sandbox = sinon.createSandbox({});

  // Verify sandbox has expected methods
  t.ok(sandbox.spy, "sandbox should have spy method");
  t.ok(sandbox.stub, "sandbox should have stub method");
  t.ok(sandbox.mock, "sandbox should have mock method");

  // Verify useFakeTimers is false by default
  t.notOk(sandbox.clock, "sandbox should not have clock by default");

  sandbox.restore();
  t.end();
});
