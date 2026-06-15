import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.rejects(errorName, errorMessage)", async (t) => {
  const stub = sinon.stub().rejects("some error name", "the pie is a lie");

  try {
    await stub();
    t.fail("should have rejected");
  } catch (error) {
    t.equal(error.name, "some error name", "error name is set");
    t.equal(error.message, "the pie is a lie", "error message is set");
  }

  t.end();
});
