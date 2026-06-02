import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.calledWith returns true,
    when instance received provided arguments`,
  (t) => {
    const f = sinon.fake();

    f("apple pie", Math.PI, "cherry pie");

    const sc = f.firstCall;

    t.ok(sc.calledWith("apple pie", Math.PI));

    t.end();
  }
);
