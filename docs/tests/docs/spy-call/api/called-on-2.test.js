import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.calledOn returns true,
    when argument is context`,
  (t) => {
    const f = sinon.fake();
    const context = {
      author: "cjno",
      hello: "world"
    };

    f.apply(context);

    const firstCall = f.firstCall;

    t.ok(firstCall.calledOn(sinon.match({ author: "cjno" })));

    t.end();
  }
);
