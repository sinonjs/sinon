import t from "tap";
import sinon from "sinon";

t.test(`fake.getCall returns a spyCall for the "nth" call to the fake`, (t) => {
  const fake = sinon.fake();

  fake("apple pie");
  fake("banana pie");

  const spyCall = fake.getCall(1);

  t.equal(spyCall.args[0], "banana pie");

  t.end();
});
