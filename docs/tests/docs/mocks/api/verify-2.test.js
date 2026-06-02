import tap from "tap";
import * as sinon from "sinon";

tap.test("mock.verify - throws when expectations not met", (t) => {
  const obj = {
    greet: function (name) {
      return `Hello ${name}`;
    }
  };
  const mock = sinon.mock(obj);
  const expectation = mock.expects("greet");

  t.throws(
    () => mock.verify(),
    /Expected greet\('\[...\]'\) once \(never called\)/,
    "throws when expectation not satisfied"
  );

  mock.restore();

  t.end();
});
