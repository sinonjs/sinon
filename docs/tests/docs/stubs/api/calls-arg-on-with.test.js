import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArgOnWith - basic usage", (t) => {
  const person = {
    name: "Mickey Mouse"
  };
  const stub = sinon
    .stub()
    .callsArgOnWith(0, person, "apple", "banana", "cherry");

  let capturedThis;
  let capturedArgs;

  function hello(first, second, third) {
    capturedThis = this;
    capturedArgs = [first, second, third];
  }

  stub(hello);

  t.equal(
    capturedThis.name,
    "Mickey Mouse",
    "callback called with person as this"
  );
  t.same(
    capturedArgs,
    ["apple", "banana", "cherry"],
    "callback received the arguments"
  );

  t.end();
});

tap.test("stub.callsArgOnWith - errors", (t) => {
  const person = {
    name: "Mickey Mouse"
  };
  const stub = sinon
    .stub()
    .callsArgOnWith(0, person, "apple", "banana", "cherry");

  t.throws(
    () => stub(undefined),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});
