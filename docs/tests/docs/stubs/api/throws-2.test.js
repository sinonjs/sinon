import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.throws(name, message)", (t) => {
  const stub = sinon.stub();

  stub.throws("PieError", "The pie is a lie");

  try {
    stub();
    t.fail("should have thrown");
  } catch (error) {
    t.equal(error.name, "PieError", "error name is set");
    t.equal(error.message, "The pie is a lie", "error message is set");
  }

  t.end();
});
