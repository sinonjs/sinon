var buster = require("buster");
var assert = buster.assert;

var format = require("../../lib/sinon/format");

buster.testCase("sinon.format", {
    "formats with formatio by default": function () {
        assert.equals(format({ id: 42 }), "{ id: 42 }");
    },

    "// should configure formatio to use maximum 250 entries": function () {
        // not sure how we can verify this integration with the current setup
        // where sinon.js calls formatio as part of it's loading
        // extracting sinon.format into a separate module would make this a lot
        // easier
    },

    "formats strings without quotes": function () {
        assert.equals(format("Hey"), "Hey");
    }
});
