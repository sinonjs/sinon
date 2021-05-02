require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const PubSub = require("pubsub-js");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("PubSub", function () {
    it("should call subscribers with message as first argument", function () {
        const message = "an example message";
        const fake = sinon.fake();

        PubSub.subscribe(message, fake);
        PubSub.publishSync(message, "some payload");

        assert.equals(message, fake.args[0][0]);
    });
});
