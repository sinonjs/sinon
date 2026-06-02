import t from "tap";
import sinon from "sinon";

t.test(`matcher allows specific comparisons`, (t) => {
  const f = sinon.fake();

  f("apple pie");

  t.ok(f.calledWith(sinon.match(sinon.match.string)));
  t.notOk(f.calledWith(sinon.match(sinon.match.number)));

  t.end();
});
