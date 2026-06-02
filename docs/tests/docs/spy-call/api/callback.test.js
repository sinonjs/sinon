import t from "tap";
import sinon from "sinon";

t.test(`spyCall.callback contains the callback of the call`, (t) => {
  const f = sinon.fake();
  const callback = function () {};

  f(1, 2, 3, callback);

  t.equal(callback, f.lastCall.callback);

  f(4, 5, 6);
  t.equal(undefined, f.lastCall.callback);

  t.end();
});
