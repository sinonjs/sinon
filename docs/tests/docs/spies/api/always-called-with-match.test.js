import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.alwaysCalledWithMatch", (t) => {
  const spy = sinon.spy();
  const object = {
    a: 1,
    b: 2,
    c: 3
  };

  spy(object);
  t.ok(
    spy.alwaysCalledWithMatch({ b: 2 }),
    "returns true after first call with matching partial object"
  );

  spy(object);
  t.ok(
    spy.alwaysCalledWithMatch({ b: 2 }),
    "returns true after second call with matching partial object"
  );

  spy("apple pie");
  t.notOk(
    spy.alwaysCalledWithMatch({ b: 2 }),
    "returns false after a call with non-matching arguments"
  );

  t.end();
});
