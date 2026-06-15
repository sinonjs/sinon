import tap from "tap";
import * as sinon from "sinon";

tap.test("mock - creating a mock", (t) => {
  const obj = {
    greet: function (name) {
      return `Hello ${name}`;
    }
  };
  const mock = sinon.mock(obj);

  t.ok(mock, "mock object created");
  t.type(mock.expects, "function", "mock has expects method");
  t.type(mock.verify, "function", "mock has verify method");
  t.type(mock.restore, "function", "mock has restore method");

  mock.restore();

  t.end();
});
