import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.leakThreshold - basic usage", (t) => {
  // Use a custom sandbox since leakThreshold is read-only on the module
  const sandbox = sinon.createSandbox();
  const threshold = 1;

  sandbox.leakThreshold = threshold;

  t.equal(sandbox.leakThreshold, threshold, "leak threshold set to 1");

  // Creating fakes will trigger warning when threshold exceeded
  // (not testing the warning itself, just that the property works)
  sandbox.fake();

  sandbox.restore();
  t.end();
});
