var buster = require("buster");
var assert = buster.assert;

var create = require("../../lib/sinon/util/create");

buster.testCase("create", {
    "is a Function": function () {
        assert.equals(typeof create, "function");
    },

    "// FIXME: what exactly is create supposed to do?": function () {}
});
