import t from "tap";
import sinon from "sinon";

t.test("accessing spy arguments via spy.getCall().args", (t) => {
  const message = "an example message";
  const spy = sinon.spy();

  // Simulate PubSub pattern
  function subscribe(topic, callback) {
    return callback;
  }

  function publishSync(topic, payload) {
    spy(message, payload);
  }

  subscribe(message, spy);
  publishSync(message, "some payload");

  // Access first argument via getCall
  t.equal(
    spy.getCall(0).args[0],
    message,
    "first argument should be the message"
  );

  t.end();
});
