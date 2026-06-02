import tap from "tap";
import * as sinon from "sinon";

const myAPI = {
  doSomething: () => "real result",
  doSomethingElse: () => "other result"
};

tap.test("myAPI", (t) => {
  const spy = sinon.spy(myAPI, "doSomething");

  myAPI.doSomething();

  t.ok(spy.calledOnce, "spy was called once");

  spy.restore();
  t.end();
});
