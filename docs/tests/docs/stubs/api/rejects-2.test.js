import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.rejects(errorName)", async (t) => {
  const stub = sinon.stub().rejects("apple pie");

  try {
    await stub();
    t.fail("should have rejected");
  } catch (error) {
    t.equal(error.name, "apple pie", "error name is set");
    t.equal(error.message, "", "error message is blank");
  }

  t.end();
});
