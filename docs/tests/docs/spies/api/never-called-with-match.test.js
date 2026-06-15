import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.neverCalledWithMatch", (t) => {
  const spy = sinon.spy();
  const object = {
    a: 1,
    b: 2,
    c: 3
  };

  t.ok(
    spy.neverCalledWithMatch({ b: 2 }),
    "returns true when spy has not been called"
  );

  spy(object);
  t.notOk(
    spy.neverCalledWithMatch({ b: 2 }),
    "returns false when spy was called with matching partial object"
  );

  spy("apple pie");
  t.ok(
    spy.neverCalledWithMatch("blueberry pie"),
    "returns true when spy was not called with matching arguments"
  );

  t.end();
});
