import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox - using the default sandbox", (t) => {
  const myObject = {
    hello: "world"
  };

  // using the stub method on the default sandbox
  sinon.stub(myObject, "hello").value("Sinon");

  t.equal(myObject.hello, "Sinon", "property stubbed to Sinon");

  sinon.restore();
  t.equal(myObject.hello, "world", "property restored to world");

  t.end();
});
