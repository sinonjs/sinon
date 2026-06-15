import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.alwaysCalledOn - passes when all calls have correct this context",
  (t) => {
    const obj = { name: "test object" };
    const fake = sinon.fake();

    fake.call(obj);
    fake.call(obj);

    t.doesNotThrow(() => {
      sinon.assert.alwaysCalledOn(fake, obj);
    }, "assertion should pass");

    t.end();
  }
);

tap.test(
  "assert.alwaysCalledOn - fails when one call has different this context",
  (t) => {
    const obj1 = { name: "obj1" };
    const obj2 = { name: "obj2" };
    const fake = sinon.fake();

    fake.call(obj1);
    fake.call(obj2);

    t.throws(
      () => sinon.assert.alwaysCalledOn(fake, obj1),
      /expected fake to always be called with/,
      "assertion should fail with different this context"
    );

    t.end();
  }
);
