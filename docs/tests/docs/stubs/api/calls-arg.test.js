import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArg - basic usage", (t) => {
  const stub = sinon.stub().callsArg(0);
  const callback = sinon.fake();

  stub(callback);

  t.ok(callback.called, "callback was called");

  t.end();
});

tap.test("stub.callsArg - errors", (t) => {
  const stub = sinon.stub().callsArg(0);

  t.throws(
    () => stub(),
    /callsArg failed: 1 arguments required but only 0 present/,
    "throws when no arguments provided"
  );

  t.throws(
    () => stub("definitely not a function"),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});
