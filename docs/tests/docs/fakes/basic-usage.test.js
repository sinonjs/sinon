import tap from "tap";
import sinon from "sinon";

tap.test("basic fake usage - creates a fake that returns a value", (t) => {
  // Create a fake that returns a value
  const fake = sinon.fake.returns(42);

  // Call it like any function
  const result = fake();
  t.equal(result, 42, "fake returns the configured value");

  // Fakes record all calls
  t.ok(fake.calledOnce, "fake.calledOnce is true");
  t.equal(
    fake.firstArg,
    undefined,
    "fake.firstArg is undefined when no arguments passed"
  );

  t.end();
});
