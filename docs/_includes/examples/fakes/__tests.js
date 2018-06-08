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
});
