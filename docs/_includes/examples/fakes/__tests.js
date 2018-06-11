"use strict";

var proxyquire = require("proxyquire").noCallThru();
var sinon = require("../../../../lib/sinon");
var assert = require("@sinonjs/referee").assert;
var stubs = {
    "sinon": {
        fake: sinon.fake,
        replace: sinon.replace
    }
};

describe("`fake` examples", function () {
    beforeEach(function () {
        sinon.replace(global.console, "log", sinon.fake());
    });

    afterEach(function () {
        sinon.restore();
    });

    // basic.js
    describe("basic invocation", function () {
        it("should output `1` on the console", function () {
            proxyquire("./basic", stubs);

            sinon.assert.calledOnce(global.console.log);
            sinon.assert.calledWithExactly(global.console.log, 1);
        });
    });

    // returns.js
    describe("returns", function () {
        it("should output 'apple pie' on the console", function () {
            proxyquire("./returns", stubs);

            sinon.assert.calledOnce(global.console.log);
            sinon.assert.calledWithExactly(global.console.log, "apple pie");
        });
    });

    // throws.js
    describe("throws", function () {
        it("should throw Error with message: 'not apple pie'", function () {
            try {
                proxyquire("./throws", stubs);
            } catch (error) {
                assert.equals(error.message, "not apple pie");
            }
        });
    });

    // resolves.js
    describe("resolves", function () {
        it("should output 'cherry pie' on the console", function (done) {
            setTimeout(function () {
                sinon.assert.calledOnce(global.console.log);
                sinon.assert.calledWithExactly(global.console.log, "cherry pie");
                done();
            }, 0);

            proxyquire("./resolves", stubs);
        });
    });

    // rejects.js
    describe("rejects", function () {
        it("should output 'not cherry pie' on the console", function (done) {
            setTimeout(function () {
                sinon.assert.calledOnce(global.console.log);
                sinon.assert.calledWithExactly(global.console.log, "not cherry pie");
                done();
            }, 0);

            proxyquire("./rejects", stubs);
        });
    });

    // yields.js
    describe("yields", function () {
        it("should output 'lemon pie' on the console", function () {
            proxyquire("./yields", stubs);

            sinon.assert.calledOnce(global.console.log);
            sinon.assert.calledWithExactly(global.console.log, "lemon pie", "key lime pie");
        });
    });

    // yields-async.js
    describe("yieldsAsync", function () {
        it("should output 'lemon pie' on the console", function (done) {
            proxyquire("./yields-async", stubs);

            sinon.assert.notCalled(global.console.log);

            setTimeout(function () {
                sinon.assert.calledOnce(global.console.log);
                sinon.assert.calledWithExactly(global.console.log, "strawberry pie");

                done();
            }, 0);
        });
    });

    // wrap-func.js
    describe("wrapping a function example", function () {
        it("should allow existing behavior", function () {
            proxyquire("./wrap-func", stubs);

            sinon.assert.calledTwice(global.console.log);

            assert.equals(global.console.log.firstCall.args[0], 4);
            assert.equals(global.console.log.secondCall.args, ["fake.calledOnce", true]);
        });
    });

    // callback.js
    describe(".callback convenience", function () {
        it("should output 'true' on the console", function () {
            proxyquire("./callback", stubs);

            sinon.assert.calledOnce(global.console.log);
            sinon.assert.calledWithExactly(global.console.log, true);
        });
    });

    // last-arg.js
    describe(".lastArg convenience", function () {
        it("should output 'true' on the console", function () {
            proxyquire("./last-arg", stubs);

            sinon.assert.calledOnce(global.console.log);
            sinon.assert.calledWithExactly(global.console.log, true);
        });
    });

    // replace.js
    describe("sinon.replace example", function () {
        it("should output '42' on the console", function () {
            proxyquire("./replace", stubs);

            sinon.assert.calledOnce(global.console.log);
            sinon.assert.calledWithExactly(global.console.log, 42);
        });
    });
});
