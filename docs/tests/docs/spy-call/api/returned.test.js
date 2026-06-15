import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.returned returns true,
    when spied function returned value on this call`,
  (t) => {
    const pie = "apple pie";
    const f = sinon.fake.returns(pie);

    f();

    const sc = f.firstCall;

    t.ok(sc.returned(pie));

    t.end();
  }
);
