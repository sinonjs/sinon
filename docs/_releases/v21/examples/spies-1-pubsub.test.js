require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const PubSub = require("pubsub-js");
const referee = require("@sinonjs/referee");
const assertTrue = referee.assert;

describe("PubSub", function () {
    it("should call subscribers on publish", function () {
        const callback = sinon.spy();

        PubSub.subscribe("message", callback);
        PubSub.publishSync("message");

        assertTrue(callback.called);
    });
});
