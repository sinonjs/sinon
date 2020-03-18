require("@fatso83/mini-mocha").install();
var sinon = require("sinon");
var PubSub = require("pubsub-js");
var referee = require("@sinonjs/referee");
var assert = referee.assert;

describe("PubSub", function() {
    it("should call all subscribers, even if there are exceptions", function() {
        var message = "an example message";
        var stub = sinon.stub().throws();
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        var clock = sinon.useFakeTimers();

        PubSub.subscribe(message, stub);
        PubSub.subscribe(message, spy1);
        PubSub.subscribe(message, spy2);

        assert.exception(function() {
            PubSub.publishSync(message, "some data");

            // PubSubJS reschedules exceptions using setTimeout(fn,0)
            // We have faked the clock, so just tick the clock to throw!
            clock.tick(1);
        });

        assert.exception(stub);
        assert(spy1.called);
        assert(spy2.called);
        assert(stub.calledBefore(spy1));

        clock.restore();
    });
});
