import t from "tap";
import sinon from "sinon";

t.test("stub(obj) stubs and restores static methods of a function or class", (t) => {
  class MyUtility {
    static format(value) {
      return value.trim();
    }
  }

  const stubs = sinon.stub(MyUtility);

  t.equal(
    MyUtility.format(" hi "),
    undefined,
    "own static methods are stubbed"
  );

  stubs.format.restore();

  t.equal(
    MyUtility.format(" hi "),
    "hi",
    "the original static method is restored"
  );

  t.end();
});
