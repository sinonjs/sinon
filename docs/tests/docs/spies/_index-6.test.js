import t from "tap";
import sinon from "sinon";

t.test("accessing spy arguments directly via spy.args", (t) => {
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

  // Access first argument of first call directly
  t.equal(spy.args[0][0], message, "first argument should be the message");

  t.end();
});
