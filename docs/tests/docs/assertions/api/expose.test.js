import t from "tap";
import sinon from "sinon";

t.test("assert.expose integrates assertions into another object", (t) => {
  // Create a target object to expose assertions onto
  const myAssert = {};

  // Expose sinon assertions with blank prefix
  sinon.assert.expose(myAssert, { prefix: "" });

  // Verify assertions are exposed without prefix
  t.ok(myAssert.called, "should have 'called' assertion");
  t.ok(myAssert.calledOnce, "should have 'calledOnce' assertion");
  t.ok(myAssert.calledWith, "should have 'calledWith' assertion");

  // Verify the exposed assertions work
  const fake = sinon.fake();
  fake("arg");

  t.doesNotThrow(() => myAssert.called(fake), "exposed assertion should work");

  t.end();
});
