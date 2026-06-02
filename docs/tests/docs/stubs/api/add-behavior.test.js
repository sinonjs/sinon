import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.addBehavior - custom behavior", (t) => {
  const name = "returnsNum";

  function fn(fake, n) {
    fake.returns(n);
  }

  sinon.addBehavior("returnsNum", fn);

  const stub = sinon.stub().returnsNum(42);

  const result = stub();

  t.equal(result, 42, "custom behavior returns 42");

  t.end();
});
