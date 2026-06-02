import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.notCalledWithMatch returns true,
    when instance received matching arguments`,
  (t) => {
    const f = sinon.fake();
    const dish = {
      name: "apple pie",
      price: Math.PI
    };

    f(dish);

    const sc = f.firstCall;

    t.ok(sc.notCalledWithMatch(sinon.match({ name: "cherry pie" })));

    t.end();
  }
);
