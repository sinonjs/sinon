import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.calledBefore returns true,
    when instance is called before the argument`,
  (t) => {
    const f = sinon.fake();

    f();
    f();
    f();

    const firstCall = f.firstCall;
    const lastCall = f.lastCall;

    t.ok(firstCall.calledBefore(lastCall));

    t.end();
  }
);
