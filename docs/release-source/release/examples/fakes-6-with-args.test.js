require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("withArgs", function () {
    it("should call method once with each argument", function () {
        const object = { method() {} };
        const fake = sinon.replace(object, "method", sinon.fake());

        object.method(42);
        object.method(1);

        assert(fake.calledWith(42));
        assert(fake.calledWith(1));
    });
});
