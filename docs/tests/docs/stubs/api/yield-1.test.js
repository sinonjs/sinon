import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yield - basic usage", (t) => {
  const stub = sinon.stub();
  let greeting;

  function callback(name) {
    greeting = `Hello ${name}`;
  }

  stub(callback);

  stub.yield("Mickey Mouse");

  t.equal(
    greeting,
    "Hello Mickey Mouse",
    "callback called with correct argument"
  );

  t.end();
});
