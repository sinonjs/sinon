import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.alwaysCalledWithExactly", (t) => {
  const spy = sinon.spy();

  t.notOk(
    spy.alwaysCalledWithExactly("apple pie"),
    "returns false when spy has not been called"
  );

  spy("apple pie");
  t.ok(
    spy.alwaysCalledWithExactly("apple pie"),
    "returns true after first call with exact arguments"
  );

  spy("apple pie");
  t.ok(
    spy.alwaysCalledWithExactly("apple pie"),
    "returns true after second call with same exact arguments"
  );

  spy("raspberry pie");
  t.notOk(
    spy.alwaysCalledWithExactly("apple pie"),
    "returns false after a call with different arguments"
  );

  t.end();
});
