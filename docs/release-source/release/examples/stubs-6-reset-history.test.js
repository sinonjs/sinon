require("@fatso83/mini-mocha").install();
var sinon = require("sinon");
var referee = require("@sinonjs/referee");
var assert = referee.assert;

describe("stub", function() {
    it("should reset history", function() {
        var stub = sinon.stub();

        assert.isFalse(stub.called);

        stub();

        assert.isTrue(stub.called);

        stub.resetHistory();

        assert.isFalse(stub.called);
    });
});
