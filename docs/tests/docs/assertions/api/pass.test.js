import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.pass - always succeeds", (t) => {
  t.doesNotThrow(() => {
    sinon.assert.pass("test assertion");
  }, "pass should not throw");

  t.end();
});

tap.test("assert.pass - can be called without arguments", (t) => {
  t.doesNotThrow(() => {
    sinon.assert.pass();
  }, "pass should work without arguments");

  t.end();
});
