var buster = require("buster");
var assert = buster.assert;

var functionName = require("../../lib/sinon/util/functionName");

buster.testCase("functionName", {
    "is a Function": function () {
        assert.equals(typeof functionName, "function");
    },

    "// FIXME: write proper tests for functionName": function () {}
});
