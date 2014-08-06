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
    }
});
