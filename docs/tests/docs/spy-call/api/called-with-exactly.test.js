import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.calledWithExactly returns true,
    when instance received provided arguments in exact same order`,
  (t) => {
    const f = sinon.fake();

    f("apple pie", Math.PI);

    const sc = f.firstCall;

    t.ok(sc.calledWithExactly("apple pie", Math.PI));

    t.end();
  }
);

t.test(
  `spyCall.calledWithExactly returns false,
    when received additional arguments`,
  (t) => {
    const f = sinon.fake();

    f("apple pie", Math.PI, "cherry pie");

    const sc = f.firstCall;

    t.notOk(sc.calledWithExactly("apple pie", Math.PI));

    t.end();
  }
);
