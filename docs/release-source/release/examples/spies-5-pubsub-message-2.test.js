const { it, describe } = (exports.lab = require("@hapi/lab").script());
const sinon = require("sinon");
const PubSub = require("pubsub-js");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("PubSub", () => {
    it("should call subscribers with message as first argument", () => {
        const message = "an example message";
        const spy = sinon.spy();

        PubSub.subscribe(message, spy);
        PubSub.publishSync(message, "some payload");

        assert.equals(message, spy.args[0][0]);
    });
});
