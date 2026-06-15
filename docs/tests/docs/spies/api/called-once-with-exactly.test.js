import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledOnceWithExactly", (t) => {
  const spy = sinon.spy();

  t.notOk(
    spy.calledOnceWithExactly("apple pie"),
    "returns false when spy has not been called"
  );

  spy("apple pie");
  t.ok(
    spy.calledOnceWithExactly("apple pie"),
    "returns true when spy was called exactly once with exact arguments"
  );

  spy("apple pie");
  t.notOk(
    spy.calledOnceWithExactly("apple pie"),
    "returns false when spy was called more than once"
  );

  // reset the history of everything
  sinon.resetHistory();

  spy("apple pie", "blueberry pie");
  t.notOk(
    spy.calledOnceWithExactly("apple pie"),
    "returns false when arguments don't match exactly"
  );

  t.end();
});
