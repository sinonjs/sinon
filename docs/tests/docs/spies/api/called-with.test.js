import t from "tap";
import sinon from "sinon";

t.test("spy.calledWith checks if spy was called with arguments", (t) => {
  const spy = sinon.spy();

  // False before any calls
  t.equal(
    spy.calledWith("apple pie"),
    false,
    "should be false before any calls"
  );

  // True after calling with the argument
  spy("apple pie");
  t.equal(
    spy.calledWith("apple pie"),
    true,
    "should be true after calling with 'apple pie'"
  );

  // False for arguments that were never used
  t.equal(
    spy.calledWith("lemon meringue pie"),
    false,
    "should be false for unused arguments"
  );

  // Reset history
  sinon.resetHistory();

  // False after reset
  t.equal(
    spy.calledWith("apple pie"),
    false,
    "should be false after resetHistory"
  );

  t.end();
});
