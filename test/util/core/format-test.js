"use strict";

var referee = require("referee");
var format = require("../../../lib/sinon/util/core/format");
var assert = referee.assert;

describe("util/core/format", function () {
    it("formats with formatio by default", function () {
        assert.equals(format({ id: 42 }), "{ id: 42 }");
    });

    it.skip("should configure formatio to use maximum 250 entries", function () {
        // not sure how we can verify this integration with the current setup
        // where sinon.js calls formatio as part of it's loading
        // extracting sinon.format into a separate module would make this a lot
        // easier
    });

    it("formats strings without quotes", function () {
        assert.equals(format("Hey"), "Hey");
    });
});
