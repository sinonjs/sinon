import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.callOrder - passes when spies called in order", (t) => {
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  const spy3 = sinon.spy();

  spy1();
  spy2();
  spy3();

  t.doesNotThrow(() => {
    sinon.assert.callOrder(spy1, spy2, spy3);
  }, "assertion should pass when called in order");

  t.end();
});

tap.test("assert.callOrder - fails when spies called out of order", (t) => {
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  const spy3 = sinon.spy();

  spy3();
  spy1();
  spy2();

  t.throws(
    () => sinon.assert.callOrder(spy1, spy2, spy3),
    /expected.*to be called in order/,
    "assertion should fail when called out of order"
  );

  t.end();
});

tap.test("assert.callOrder - works with subset of spies", (t) => {
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();

  spy1();
  spy2();

  t.doesNotThrow(() => {
    sinon.assert.callOrder(spy1, spy2);
  }, "assertion should pass when spies called in order");

  t.end();
});
