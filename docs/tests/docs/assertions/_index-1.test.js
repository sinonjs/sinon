import t from "tap";
import sinon from "sinon";

t.test("without sinon.assert, failures lack helpful context", (t) => {
  const f = sinon.fake();

  // Using generic assertion without sinon.assert provides less helpful errors
  // This would fail with a generic "expected false to be true" message
  t.notOk(f.calledOnce, "fake should not be called yet");

  // Call the fake
  f();

  // Now it should be true
  t.ok(f.calledOnce, "fake should be called once");

  t.end();
});
