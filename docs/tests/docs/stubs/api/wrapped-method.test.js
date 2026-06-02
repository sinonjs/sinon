import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.wrappedMethod", (t) => {
  const obj = {
    hello: function hello(name) {
      return `Hello ${name}`;
    }
  };

  const s = sinon.stub(obj, "hello").callsFake(function hi(name) {
    return `Hi ${name}`;
  });

  t.equal(
    obj.hello("Mickey Mouse"),
    "Hi Mickey Mouse",
    "stub returns fake value"
  );

  t.equal(
    obj.hello.wrappedMethod("Mickey Mouse"),
    "Hello Mickey Mouse",
    "wrappedMethod returns original value"
  );

  s.restore();
  t.end();
});
