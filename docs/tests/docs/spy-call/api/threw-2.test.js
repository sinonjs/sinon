import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.threw returns true,
    when spied function threw provided error type on this call`,
  (t) => {
    const f = sinon.fake.throws(new TypeError("The pie is a lie"));
    let sc;

    try {
      f();
    } catch (ex) {
      sc = f.firstCall;
    }

    t.ok(sc.threw("TypeError"));

    t.end();
  }
);
