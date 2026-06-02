import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.resolves", async (t) => {
  const stub = sinon.stub().resolves("apple pie");

  const result = await stub();

  t.equal(result, "apple pie", "stub resolves with the provided value");

  t.end();
});
