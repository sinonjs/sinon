import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yieldsOn - basic usage", (t) => {
  const person = {
    name: "Mickey Mouse"
  };

  const stub = sinon.stub().yieldsOn(person);
  let capturedThis;

  function hello() {
    capturedThis = this;
  }

  stub(hello);

  t.equal(capturedThis, person, "callback called with person as this");
  t.equal(capturedThis.name, "Mickey Mouse", "this.name is Mickey Mouse");

  t.end();
});
