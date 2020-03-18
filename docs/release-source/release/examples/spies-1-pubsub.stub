require("@fatso83/mini-mocha").install();
var sinon = require("sinon");
var PubSub = require("pubsub-js");
var referee = require("@sinonjs/referee");
var assertTrue = referee.assert;

describe("PubSub", function() {
    it("should call subscribers on publish", function() {
        var callback = sinon.spy();

        PubSub.subscribe("message", callback);
        PubSub.publishSync("message");

        assertTrue(callback.called);
    });
});
