import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsFake", (t) => {
  const myObj = {};
  myObj.prop = function propFn() {
    return "foo";
  };

  function f() {
    return "bar";
  }

  sinon.stub(myObj, "prop").callsFake(f);

  t.equal(myObj.prop(), "bar", "stub calls the fake function");

  sinon.restore();
  t.end();
});
