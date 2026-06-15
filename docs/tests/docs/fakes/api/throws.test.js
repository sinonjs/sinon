import tap from "tap";
import * as sinon from "sinon";

tap.test("fake.throws", (t) => {
  // use a string
  const fake1 = sinon.fake.throws("not apple pie");

  // use an Error
  const fake2 = sinon.fake.throws(new Error("not peach pie"));

  // Expected to throw an error with message 'not apple pie'
  t.throws(
    () => fake1(),
    { message: "not apple pie" },
    "fake1 throws error with string message"
  );

  // Expected to throw an error with message 'not peach pie'
  t.throws(
    () => fake2(),
    { message: "not peach pie" },
    "fake2 throws error with Error object"
  );

  t.end();
});
