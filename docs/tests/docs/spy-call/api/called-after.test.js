import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.calledAfter returns true,
    when instance is called after the argument`,
  (t) => {
    const f = sinon.fake();

    f();
    f();
    f();

    const firstCall = f.firstCall;
    const lastCall = f.lastCall;

    t.ok(lastCall.calledAfter(firstCall));

    t.end();
  }
);
