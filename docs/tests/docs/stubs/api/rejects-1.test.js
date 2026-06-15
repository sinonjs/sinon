import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.rejects() - no arguments", async (t) => {
  const stub = sinon.stub().rejects();

  try {
    await stub();
    t.fail("should have rejected");
  } catch (error) {
    t.ok(error instanceof Error, "rejects with an Error");
    t.equal(error.message, "Error", "error message is 'Error'");
  }

  t.end();
});
