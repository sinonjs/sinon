import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledWithMatch", (t) => {
  const spy = sinon.spy();
  const object = {
    a: 1,
    b: 2,
    c: 3
  };

  spy(object);
  t.ok(
    spy.calledWithMatch({ b: 2 }),
    "returns true when spy was called with matching partial object"
  );

  t.notOk(
    spy.calledWithMatch({ b: 1 }),
    "returns false when spy was not called with matching arguments"
  );

  t.end();
});
