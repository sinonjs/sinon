import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.throwsArg", (t) => {
  const stub1 = sinon.stub();

  stub1.throwsArg(0);

  try {
    stub1("Apple pie");
    t.fail("should have thrown");
  } catch (error) {
    t.equal(error, "Apple pie", "throws the first argument");
  }

  const stub2 = sinon.stub();
  stub2.throwsArg(42);

  try {
    stub2("Apple pie");
    t.fail("should have thrown");
  } catch (error) {
    t.match(
      error.message,
      /throwsArg failed: 43 arguments required but only 1 present/,
      "throws TypeError when argument not available"
    );
  }

  t.end();
});
