const { it, describe } = (exports.lab = require("@hapi/lab").script());
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("withArgs", () => {
    it("should call method once with each argument", () => {
        const object = { method() {} };
        const spy = sinon.spy(object, "method");

        object.method(42);
        object.method(1);

        assert(spy.withArgs(42).calledOnce);
        assert(spy.withArgs(1).calledOnce);
    });
});
