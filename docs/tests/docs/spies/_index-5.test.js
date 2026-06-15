import t from "tap";
import sinon from "sinon";

t.test("spy.calledWith checks if spy was called with arguments", (t) => {
  const message = "an example message";
  const spy = sinon.spy();

  // Simulate PubSub pattern
  function subscribe(topic, callback) {
    // Store the callback for later
    return callback;
  }

  function publishSync(topic, payload) {
    // Call subscriber with message as first argument
    spy(message, payload);
  }

  subscribe(message, spy);
  publishSync(message, "some payload");

  // Verify spy was called with the message
  t.ok(spy.calledWith(message), "spy should be called with message");

  t.end();
});
