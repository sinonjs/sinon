import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.calledWithMatch returns true,
    when instance received matching arguments`,
  (t) => {
    const f = sinon.fake();
    const dish = {
      name: "apple pie",
      price: Math.PI
    };

    f(dish);

    const sc = f.firstCall;

    t.ok(sc.calledWithMatch(sinon.match({ name: "apple pie" })));

    t.end();
  }
);
