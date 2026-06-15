import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.invokeCallback - alias for yield", (t) => {
  const stub = sinon.stub();
  let greeting;

  function callback(name) {
    greeting = `Hello ${name}`;
  }

  stub(callback);

  stub.invokeCallback("Mickey Mouse");

  t.equal(
    greeting,
    "Hello Mickey Mouse",
    "invokeCallback works as alias for yield"
  );

  t.end();
});
