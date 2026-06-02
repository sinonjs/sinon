import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArgOn - basic usage", (t) => {
  const person = {
    name: "Mickey Mouse"
  };
  const stub = sinon.stub().callsArgOn(0, person);
  let capturedThis;

  function hello() {
    capturedThis = this;
  }

  stub(hello);

  t.equal(capturedThis, person, "callback called with person as this");
  t.equal(capturedThis.name, "Mickey Mouse", "this.name is Mickey Mouse");

  t.end();
});

tap.test("stub.callsArgOn - errors", (t) => {
  const person = {
    name: "Mickey Mouse"
  };
  const stub = sinon.stub().callsArgOn(0, person);

  t.throws(
    () => stub(),
    /callsArg failed: 1 arguments required but only 0 present/,
    "throws when no arguments provided"
  );

  t.throws(
    () => stub(undefined),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});
