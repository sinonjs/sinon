import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.calledImmediatelyAfter returns true,
    when instance is called immediately after the argument`,
  (t) => {
    const f1 = sinon.fake();
    const f2 = sinon.fake();

    f1();
    f2();

    const f1Call = f1.firstCall;
    const f2Call = f2.firstCall;

    t.ok(f2Call.calledImmediatelyAfter(f1Call));

    t.end();
  }
);

t.test(
  `spyCall.calledImmediatelyAfter returns true,
    when instance is not called immediately after the argument`,
  (t) => {
    const f1 = sinon.fake();
    const f2 = sinon.fake();

    f1();
    f1();
    f2();

    const f1Call = f1.firstCall;
    const f2Call = f2.firstCall;

    t.notOk(f2Call.calledImmediatelyAfter(f1Call));

    t.end();
  }
);
