import referee from "@sinonjs/referee";
import sinon from "../../src/sinon.js";

const assert = referee.assert;

describe("behavior extra tests", function () {
    it("should throw when calling stub.onCall(n).withArgs(...)", function () {
        const stub = sinon.stub();
        assert.exception(
            function () {
                stub.onCall(0).withArgs(1);
            },
            {
                message:
                    /Defining a stub by invoking "stub.onCall\(...\)\.withArgs\(...\)" is not supported/,
            },
        );
    });

    it("should throw if callsArg is called with index out of bounds", function () {
        const stub = sinon.stub().callsArg(0);
        assert.exception(
            function () {
                stub();
            },
            {
                name: "TypeError",
                message:
                    /callsArg failed: 1 arguments required but only 0 present/,
            },
        );
    });

    it("should throw if yieldsTo is called but no object with property is passed", function () {
        const stub = sinon.stub().yieldsTo("cb");
        assert.exception(
            function () {
                stub(1, 2, 3);
            },
            {
                name: "TypeError",
                message:
                    /expected to yield to 'cb', but no object with such a property was passed/,
            },
        );
    });

    it("should throw if yields is called but no callback was passed", function () {
        const stub = sinon.stub().yields();
        assert.exception(
            function () {
                stub(1, 2, 3);
            },
            {
                name: "TypeError",
                message: /expected to yield, but no callback was passed/,
            },
        );
    });
});
