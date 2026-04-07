import referee from "@sinonjs/referee";
import sinon from "../../src/sinon.js";

const assert = referee.assert;

describe("behaviors", function () {
    it("adds and uses a custom behavior", function () {
        sinon.addBehavior("returnsNum", function (fake, n) {
            fake.returns(n);
        });

        const stub = sinon.stub().returnsNum(42);

        assert.equals(stub(), 42);
    });
});
