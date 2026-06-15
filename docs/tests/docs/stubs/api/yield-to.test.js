import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yieldTo - basic usage", (t) => {
  const stub = sinon.stub();
  let actual;

  const object = {
    success() {
      actual = "Success!";
    },
    failure(errorCode) {
      actual = `${errorCode}: Oh noes!`;
    }
  };

  // call the stub with the object
  stub(object);

  // define a property name to yield to
  const successPropertyName = "success";
  stub.yieldTo(successPropertyName);

  // evaluate the result
  t.equal(actual, "Success!", "success callback was called");

  // define a property name to yield to
  const failurePropertyName = "failure";
  // define the optional argument
  const errorCode = "429";

  stub.yieldTo(failurePropertyName, errorCode);

  // evaluate the result
  t.equal(
    actual,
    "429: Oh noes!",
    "failure callback was called with error code"
  );

  t.end();
});
