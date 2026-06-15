import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.fail - throws with message", (t) => {
  t.throws(
    () => sinon.assert.fail("custom failure message"),
    /custom failure message/,
    "fail should throw with provided message"
  );

  t.end();
});

tap.test("assert.fail - throws AssertError", (t) => {
  try {
    sinon.assert.fail("test");
    t.fail("should have thrown");
  } catch (e) {
    t.equal(e.name, "AssertError", "error should be AssertError");
  }

  t.end();
});
