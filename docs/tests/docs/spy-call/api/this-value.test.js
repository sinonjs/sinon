import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.thisValue contains a reference to the
    context ("this") used in the call`,
  (t) => {
    const context = {};
    const f = sinon.fake();

    f.apply(context);
    t.equal(f.lastCall.thisValue, context);

    f();
    t.equal(f.lastCall.thisValue, this);

    const object = {
      method: sinon.fake()
    };
    object.method();
    t.equal(object.method.lastCall.thisValue, object);

    t.end();
  }
);
