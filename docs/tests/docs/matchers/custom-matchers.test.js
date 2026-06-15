import t from "tap";
import sinon from "sinon";

function test(value) {
  return Boolean(value);
}
const trueIsh = sinon.match(test);

t.test(`custom matcher`, (t) => {
  const f = sinon.fake();

  f("apple pie");

  t.ok(f.calledWith(trueIsh));

  t.end();
});
