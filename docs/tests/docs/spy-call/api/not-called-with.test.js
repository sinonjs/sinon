import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.notCalledWith returns true,
    when instance did not receive provided arguments`,
  (t) => {
    const f = sinon.fake();

    f("apple pie", Math.PI);

    const sc = f.firstCall;

    t.ok(sc.notCalledWith("cherry pie"));

    t.end();
  }
);
