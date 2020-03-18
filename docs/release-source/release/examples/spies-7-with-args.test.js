require("@fatso83/mini-mocha").install();
var sinon = require("sinon");
var referee = require("@sinonjs/referee");
var assert = referee.assert;

describe("withArgs", function() {
    it("should call method once with each argument", function() {
        var object = { method: function() {} };
        var spy = sinon.spy(object, "method");

        object.method(42);
        object.method(1);

        assert(spy.withArgs(42).calledOnce);
        assert(spy.withArgs(1).calledOnce);
    });
});
