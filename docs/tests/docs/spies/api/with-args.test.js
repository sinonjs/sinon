import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.withArgs", (t) => {
  const object = { method() {} };
  const spy = sinon.spy(object, "method");

  object.method(42);
  object.method(1);

  t.ok(spy.withArgs(42).calledOnce, "spy.withArgs(42) was called once");

  t.ok(spy.withArgs(1).calledOnce, "spy.withArgs(1) was called once");

  object.method("a", "b", "c");
  t.ok(
    spy.withArgs("a", "b", "c").calledOnce,
    "spy.withArgs with multiple arguments was called once"
  );

  spy.restore();
  t.end();
});
