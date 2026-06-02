import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.value - restoring values", (t) => {
  const myObj = {
    example: "oldValue"
  };

  const stub = sinon.stub(myObj, "example").value("newValue");
  t.equal(myObj.example, "newValue", "property has new value");

  stub.restore();

  t.equal(myObj.example, "oldValue", "property restored to old value");

  t.end();
});
