import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.value - basic usage", (t) => {
  const myObj = {
    example: "oldValue"
  };

  sinon.stub(myObj, "example").value("newValue");

  t.equal(myObj.example, "newValue", "property has new value");

  sinon.restore();
  t.end();
});
