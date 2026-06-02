import tap from "tap";
import * as sinon from "sinon";

tap.test("fake.resolves", async (t) => {
  const fake = sinon.fake.resolves("Apple pie");

  const value = await fake();

  t.equal(value, "Apple pie", "fake resolves with provided value");

  t.end();
});
