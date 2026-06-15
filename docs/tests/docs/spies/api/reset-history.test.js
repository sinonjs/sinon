import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.resetHistory", (t) => {
  const s = sinon.spy();

  t.equal(s.callCount, 0, "callCount starts at 0");

  s();
  t.equal(s.callCount, 1, "callCount is 1 after one call");

  s.resetHistory();
  t.equal(s.callCount, 0, "callCount is 0 after resetHistory");

  s();
  t.equal(s.callCount, 1, "callCount is 1 again after another call");

  t.end();
});
