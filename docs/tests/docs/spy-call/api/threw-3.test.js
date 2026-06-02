import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.threw returns true,
    when spied function threw provided object on this call`,
  (t) => {
    const error = new TypeError("The pie is a lie");
    const f = sinon.fake.throws(error);
    let sc;

    try {
      f();
    } catch (ex) {
      sc = f.firstCall;
    }

    t.ok(sc.threw(error));

    t.end();
  }
);
