import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.any", (t) => {
  const fake = sinon.fake();

  // Matches string values
  fake("hello");
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.any);
  }, "should accept string");

  // Matches number values
  fake(42);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.any);
  }, "should accept number");

  // Matches object values
  fake({ name: "Alice" });
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.any);
  }, "should accept object");

  // Matches null
  fake(null);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.any);
  }, "should accept null");

  // Matches undefined
  fake(undefined);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.any);
  }, "should accept undefined");

  t.end();
});
