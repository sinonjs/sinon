import tap from "tap";
import * as sinon from "sinon";

tap.test("fake.returns", (t) => {
  const value = "apple pie";
  const f = sinon.fake.returns(value);

  t.equal(f(), "apple pie", "fake returns the provided value");

  t.end();
});
