require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const PubSub = require("pubsub-js");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("PubSub", function() {
    it("should call all subscribers, even if there are exceptions", function() {
        const message = "an example message";
        const stub = sinon.stub().throws();
        const spy1 = sinon.spy();
        const spy2 = sinon.spy();
        const clock = sinon.useFakeTimers();

        PubSub.subscribe(message, stub);
        PubSub.subscribe(message, spy1);
        PubSub.subscribe(message, spy2);

        assert.exception(() => {
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
