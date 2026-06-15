import tap from "tap";
import * as sinon from "sinon";

tap.test("Using fakes instead of spies", (t) => {
  const foo = {
    bar: () => "baz"
  };

  // wrap existing method without changing its behavior
  const fake = sinon.replace(foo, "bar", sinon.fake(foo.bar));

  // behavior is the same
  t.equal(fake(), "baz", "fake returns original behavior");

  // records information about calls
  t.equal(fake.callCount, 1, "callCount is tracked");

  sinon.restore();
  t.end();
});
