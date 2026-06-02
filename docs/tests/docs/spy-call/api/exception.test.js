import t from "tap";
import sinon from "sinon";

t.test(`spyCall.exception contains the error thrown`, (t) => {
  const error = new Error("The pie is a lie");
  const f = sinon.fake.throws(error);

  try {
    f();
  } catch (thrownError) {
    t.equal(thrownError, f.lastCall.exception);
  }
  t.equal(error, f.lastCall.exception);

  t.end();
});

t.test(`spyCall.exception is undefined when no error thrown`, (t) => {
  const f = sinon.fake();

  f();
  t.equal(undefined, f.lastCall.exception);

  t.end();
});
