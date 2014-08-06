/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

if (typeof require === "function" && typeof module === "object") {
    var buster = require("../runner");
    var sinon = require("../../lib/sinon");
}

buster.testCase("sinon.format", {
    "formats with formatio by default": function () {
        assert.equals(sinon.format({ id: 42 }), "{ id: 42 }");
    },

    "// should configure formatio to use maximum 250 entries": function () {
        // not sure how we can verify this integration with the current setup
        // where sinon.js calls formatio as part of it's loading
        // extracting sinon.format into a separate module would make this a lot
        // easier
    },

    "formats strings without quotes": function () {
        assert.equals(sinon.format("Hey"), "Hey");
    }
});
