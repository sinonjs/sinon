import tap from "tap";
import * as sinon from "sinon";

tap.test("spy properties and methods example", (t) => {
  const object = {
    greet: function greet(name) {
      // No console.log for testing
      return `Hello ${name}`;
    }
  };
  const spy = sinon.spy(object, "greet");

  // the greet method now has extra properties and methods
  t.equal(
    typeof object.greet.calledOnce,
    "boolean",
    "greet has calledOnce property"
  );

  // these are equivalent
  t.equal(
    typeof spy.calledOnce,
    typeof object.greet.calledOnce,
    "spy.calledOnce and object.greet.calledOnce are the same type"
  );

  spy.restore();
  t.end();
});
