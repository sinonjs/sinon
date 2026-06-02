import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArgOnWithAsync - basic usage", async (t) => {
  const clock = sinon.useFakeTimers();
  const person = {
    name: "Mickey Mouse"
  };
  const stub = sinon.stub().callsArgOnWithAsync(0, person, "Donald Duck");

  function rename(newName) {
    this.name = newName;
  }

  stub(rename);
  t.equal(person.name, "Mickey Mouse", "name is Mickey Mouse immediately");

  await clock.tickAsync(1);
  t.equal(
    person.name,
    "Donald Duck",
    "name is Donald Duck after async callback"
  );

  clock.restore();
  t.end();
});

tap.test("stub.callsArgOnWithAsync - errors", (t) => {
  const person = {
    name: "Mickey Mouse"
  };
  const stub = sinon.stub().callsArgOnWithAsync(0, person, "Donald Duck");

  t.throws(
    () => stub(undefined),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});
