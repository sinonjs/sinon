import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.restore", (t) => {
  const obj = {
    hello: () => {
      return "world";
    }
  };

  const s = sinon.stub(obj, "hello").callsFake(() => {
    return "sailor";
  });

  t.equal(obj.hello(), "sailor", "stub returns stubbed value");

  s.restore();

  t.equal(obj.hello(), "world", "original method restored");

  t.end();
});
