import tap from "tap";
import * as sinon from "sinon";

tap.test("Using fakes instead of stubs", (t) => {
  const foo = {
    bar: () => "baz"
  };

  // replace method with a fake one
  const fake = sinon.replace(foo, "bar", sinon.fake.returns("fake value"));

  // returns fake value
  t.equal(foo.bar(), "fake value", "fake returns fake value");

  // records information about calls
  t.equal(fake.callCount, 1, "callCount is tracked");

  sinon.restore();
  t.end();
});
