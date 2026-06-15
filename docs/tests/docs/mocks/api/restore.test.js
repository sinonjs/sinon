import tap from "tap";
import * as sinon from "sinon";

tap.test("mock.restore - restores all mocked methods", (t) => {
  const obj = {
    greet: function (name) {
      return `Hello ${name}`;
    }
  };
  const mock = sinon.mock(obj);
  const expectation = mock.expects("greet");

  obj.greet("Mickey Mouse");

  // mocked methods have a restore method on them
  t.equal(
    typeof obj.greet.restore,
    "function",
    "mocked method has restore function"
  );

  mock.restore();

  // the original greet method has been restored
  t.equal(
    typeof obj.greet.restore,
    "undefined",
    "restored method no longer has restore function"
  );

  t.end();
});
