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

    "#624": {
        "//useFakeTimers should be idempotent": function () {
            // Issue #624 shows that useFakeTimers is not idempotent when it comes to
            // using Date.now
            // This test verifies that it's working, at least for Date.now
            var clock;

            clock = sinon.useFakeTimers(new Date("2014-12-29").getTime());
            assert.equals(clock.now, Date.now());

            clock = sinon.useFakeTimers(new Date("2015-12-15").getTime());
            assert.equals(clock.now, Date.now());

            clock = sinon.useFakeTimers(new Date("2015-1-5").getTime());
            assert.equals(clock.now, Date.now());
        }
    }
});
