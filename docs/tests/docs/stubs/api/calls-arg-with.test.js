import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.callsArgWith - basic usage", (t) => {
  const stub = sinon.stub().callsArgWith(0, "apple", "banana", "cherry");
  const callback = sinon.fake();

  stub(callback);

  t.ok(callback.calledOnce, "callback was called once");
  t.ok(
    callback.calledWith("apple", "banana", "cherry"),
    "callback was called with provided arguments"
  );

  t.end();
});

tap.test("stub.callsArgWith - errors", (t) => {
  const stub = sinon.stub().callsArgWith(0, "apple", "banana", "cherry");

  t.throws(
    () => stub(undefined),
    /argument at index 0 is not a function/,
    "throws when argument is not a function"
  );

  t.end();
});
