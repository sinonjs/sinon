import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.threw(type) - specific type", (t) => {
  const f = sinon.fake.throws(new TypeError("a specific error"));

  try {
    f();
  } catch (e) {
    // Expected to throw
  }

  t.ok(f.threw("TypeError"), "returns true when fake threw TypeError");

  t.notOk(
    f.threw("ArgumentError"),
    "returns false when fake did not throw ArgumentError"
  );

  sinon.reset();

  t.notOk(f.threw("TypeError"), "returns false after reset");

  t.end();
});
