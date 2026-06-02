import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.fake throws when passed a non-function argument", (t) => {
  t.throws(
    () => sinon.fake("not a function"),
    /Expected f argument to be a Function/,
    "throws TypeError when argument is not a function"
  );

  t.throws(
    () => sinon.fake(42),
    /Expected f argument to be a Function/,
    "throws TypeError when argument is a number"
  );

  t.throws(
    () => sinon.fake({}),
    /Expected f argument to be a Function/,
    "throws TypeError when argument is an object"
  );

  t.end();
});
