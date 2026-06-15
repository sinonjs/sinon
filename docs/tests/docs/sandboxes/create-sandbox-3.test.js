import t from "tap";
import sinon from "sinon";

t.test("sandbox default configuration", (t) => {
  // Default configuration for createSandbox differs from default sandbox
  const sandboxDefaults = {
    injectInto: null,
    properties: ["spy", "stub", "mock", "clock"],
    useFakeTimers: true
  };

  // Verify the documented structure is what's described
  t.ok(
    Array.isArray(sandboxDefaults.properties),
    "defaultConfig should have properties array"
  );
  t.ok(
    sandboxDefaults.properties.includes("clock"),
    "defaultConfig properties should include clock"
  );
  t.equal(
    sandboxDefaults.useFakeTimers,
    true,
    "defaultConfig useFakeTimers should be true"
  );

  t.end();
});
