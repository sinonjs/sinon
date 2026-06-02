import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.threw returns true,
    when spied function threw on this call`,
  (t) => {
    const f = sinon.fake.throws("The pie is a lie");
    let sc;

    try {
      f();
    } catch (ex) {
      sc = f.firstCall;
    }

    t.ok(sc.threw());

    t.end();
  }
);
