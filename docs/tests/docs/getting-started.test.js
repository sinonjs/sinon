// import the test framework
import tap from "tap";

// import sinon
import * as sinon from "sinon";

tap.test("this is a test", (t) => {
  // create a fake
  const fake = sinon.fake();

  // call the fake
  fake();

  // assert on the fake
  t.ok(fake.calledOnce);

  t.end();
});
