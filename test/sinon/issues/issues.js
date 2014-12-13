/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

if (typeof require == "function" && typeof module == "object") {
    var buster = require("../../runner");
    var sinon = require("../../../lib/sinon");
}

buster.testCase("issues", {
    setUp: function () {
        this.sandbox = sinon.sandbox.create();
    },

    tearDown: function () {
        this.sandbox.restore();

        if (this.clock){
            this.clock.restore();
        }
    },

    "#458": {
        "on node": {
            requiresSupportFor: {
                process: typeof process !== "undefined"
            },

            "stub out fs.readFileSync": function () {
                var testCase = this,
                    fs = require("fs"),
                    stub;

                refute.exception(function () {
                    testCase.sandbox.stub(fs, "readFileSync");
                });
            }
        }
    },

    // Issue #624 shows that useFakeTimers is not idempotent when it comes to
    // using Date.now
    // This test verifies that it's working, at least for Date.now
    "#624 - useFakeTimers should be idempotent": function () {
        var testCase = this;

        testCase.clock = sinon.useFakeTimers(new Date("2014-12-29").getTime());
        assert.equals(testCase.clock.now, Date.now());

        testCase.clock = sinon.useFakeTimers(new Date("2015-12-15").getTime());
        assert.equals(testCase.clock.now, Date.now());

        testCase.clock = sinon.useFakeTimers(new Date("2015-1-5").getTime());
        assert.equals(testCase.clock.now, Date.now());
    }
});
