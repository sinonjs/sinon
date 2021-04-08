require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;
const bluebird = require("bluebird");

const myObj = {
    saveSomething: sinon.stub().usingPromise(bluebird.Promise).resolves("baz"),
};

describe("stub", function () {
    it("should resolve using specific Promise library", function () {
        myObj.saveSomething().tap(function (actual) {
            assert.equals(actual, "baz");
        });
    });
});
