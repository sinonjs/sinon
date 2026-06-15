import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.neverCalledWith", (t) => {
  const spy = sinon.spy();

  t.ok(
    spy.neverCalledWith("apple pie"),
    "returns true when spy has not been called at all"
  );

  spy("apple pie");
  t.notOk(
    spy.neverCalledWith("apple pie"),
    "returns false when spy was called with those arguments"
  );

  t.ok(
    spy.neverCalledWith("blueberry pie"),
    "returns true when spy was not called with specific arguments"
  );

  spy("blueberry pie");
  t.notOk(
    spy.neverCalledWith("blueberry pie"),
    "returns false when spy was now called with those arguments"
  );

  // reset the history of everything
  sinon.resetHistory();

  t.ok(spy.neverCalledWith("apple pie"), "returns true after reset");

  t.end();
});
