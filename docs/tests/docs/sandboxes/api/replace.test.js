import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.replace - basic usage", (t) => {
  // The sinon root object is a default sandbox
  var myObject = {
    myMethod: function () {
      return "apple pie";
    }
  };

  sinon.replace(myObject, "myMethod", function () {
    return "strawberry";
  });

  const result = myObject.myMethod();
  t.equal(result, "strawberry", "method replaced with strawberry");

  sinon.restore();

  t.end();
});
