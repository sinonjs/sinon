"use strict";

var proxyquire = require("proxyquire").noCallThru();
var sinon = require("../../../../lib/sinon");
var assert = require("@sinonjs/referee").assert;

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
            proxyquire("./basic", {
                "sinon": {
                    fake: sinon.fake
                }
            });

            sinon.assert.calledOnce(global.console.log);
            sinon.assert.calledWithExactly(global.console.log, 1);
        });
    });

    // returns.js
    describe("returns", function () {
        it("should output 'apple pie' on the console", function () {
            proxyquire("./returns", {
                "sinon": {
                    fake: sinon.fake
                }
            });

            sinon.assert.calledOnce(global.console.log);
            sinon.assert.calledWithExactly(global.console.log, "apple pie");
        });
    });

    // throws.js
    describe("throws", function () {
        it("should throw Error with message: 'not apple pie'", function () {
            try {
                proxyquire("./throws", {
                    "sinon": {
                        fake: sinon.fake
                    }
                });
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

            proxyquire("./resolves", {
                "sinon": {
                    fake: sinon.fake
                }
            });
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

            proxyquire("./rejects", {
                "sinon": {
                    fake: sinon.fake
                }
            });
        });
    });

    // yields.js
    describe("yields", function () {
        it("should output 'lemon pie' on the console", function () {
            proxyquire("./yields", {
                "sinon": {
                    fake: sinon.fake
                }
            });

            sinon.assert.calledOnce(global.console.log);
            sinon.assert.calledWithExactly(global.console.log, "lemon pie", "key lime pie");
        });
    });

    // yields-async.js
    describe("yieldsAsync", function () {
        it("should output 'lemon pie' on the console", function (done) {
            proxyquire("./yields-async", {
                "sinon": {
                    fake: sinon.fake
                }
            });

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
            proxyquire("./wrap-func", {
                "sinon": {
                    fake: sinon.fake
                }
            });

            sinon.assert.calledTwice(global.console.log);

            assert.equals(global.console.log.firstCall.args[0], 4);
            assert.equals(global.console.log.secondCall.args, ["fake.calledOnce", true]);
        });
    });

    // callback.js
    describe(".callback convenience", function () {
        it("should output 'true' on the console", function () {
            proxyquire("./callback", {
                "sinon": {
                    fake: sinon.fake
                }
            });

            sinon.assert.calledOnce(global.console.log);
            sinon.assert.calledWithExactly(global.console.log, true);
        });
    });
});
