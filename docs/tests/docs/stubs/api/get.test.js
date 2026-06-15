import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.get", (t) => {
  const myObj = {
    prop: "foo"
  };

  sinon.stub(myObj, "prop").get(function getterFn() {
    return "bar";
  });

  t.equal(myObj.prop, "bar", "getter returns stubbed value");

  sinon.restore();
  t.end();
});
