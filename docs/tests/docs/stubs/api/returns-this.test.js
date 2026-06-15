import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.returnsThis", (t) => {
  const myObj = {
    one: function () {},
    two: function () {
      return "apple pie";
    }
  };

  const stub = sinon.stub(myObj, "one").returnsThis();

  t.equal(myObj.one().two(), "apple pie", "stub returns this for chaining");

  stub.restore();
  t.end();
});
