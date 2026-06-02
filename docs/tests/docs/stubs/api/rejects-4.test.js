import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.rejects(error)", async (t) => {
  const pieError = new RangeError("The pie is a lie");
  const stub = sinon.stub().rejects(pieError);

  try {
    await stub();
    t.fail("should have rejected");
  } catch (error) {
    t.equal(error, pieError, "rejects with the exact error instance");
  }

  t.end();
});
