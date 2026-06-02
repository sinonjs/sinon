import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.replaceGetter - basic usage", (t) => {
  // The sinon root object is a default sandbox
  const object = {
    get myProperty() {
      return "apple pie";
    }
  };

  sinon.replaceGetter(object, "myProperty", function () {
    return "strawberry";
  });

  t.equal(object.myProperty, "strawberry", "getter replaced");

  sinon.restore();

  t.end();
});
