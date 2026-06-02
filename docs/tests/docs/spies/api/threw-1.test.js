import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.threw - general", (t) => {
  const f = sinon.fake.throws(new Error("oh dear"));

  try {
    f();
  } catch (e) {
    // Expected to throw
  }

  t.ok(f.threw(), "returns true when fake threw an exception");

  sinon.reset();

  t.notOk(f.threw(), "returns false after reset");

  t.end();
});
