require("@fatso83/mini-mocha").install();
var sinon = require("sinon");
var referee = require("@sinonjs/referee");
var assert = referee.assert;
var bluebird = require("bluebird");

var myObj = {
    saveSomething: sinon
        .stub()
        .usingPromise(bluebird.Promise)
        .resolves("baz")
};

describe("stub", function() {
    it("should resolve using specific Promise library", function() {
        myObj.saveSomething().tap(function(actual) {
            assert.equals(actual, "baz");
        });
    });
});
