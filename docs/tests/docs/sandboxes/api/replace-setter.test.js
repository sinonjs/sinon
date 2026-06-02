import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.replaceSetter - basic usage", (t) => {
  // The sinon root object is a default sandbox
  const object = {
    set myProperty(value) {
      this.prop = value;
    }
  };

  sinon.replaceSetter(object, "myProperty", function (value) {
    this.prop = "strawberry " + value;
  });

  object.myProperty = "pie";

  t.equal(object.prop, "strawberry pie", "setter replaced and called");

  sinon.restore();

  t.end();
});
