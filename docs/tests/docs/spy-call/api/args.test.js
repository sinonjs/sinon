import t from "tap";
import sinon from "sinon";

t.test(
  `spyCall.args contains an array of arrays
    containing received arguments for each call`,
  (t) => {
    const f = sinon.fake();

    f("apple pie");
    f("banana pie");
    f("cherry pie");

    t.same(f.args, [["apple pie"], ["banana pie"], ["cherry pie"]]);

    t.end();
  }
);
