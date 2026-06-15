import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.resolvesArg", async (t) => {
  const stub = sinon.stub().resolvesArg(1);

  const result = await stub("apple pie", "blueberry pie", "cherry pie");
  t.equal(result, "blueberry pie", "resolves with argument at index 1");

  try {
    await stub("apple pie");
    t.fail("should have rejected");
  } catch (error) {
    t.match(
      error.message,
      /resolvesArg failed: 2 arguments required but only 1 present/,
      "rejects when argument not available"
    );
  }

  t.end();
});
