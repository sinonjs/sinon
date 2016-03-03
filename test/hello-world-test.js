"use strict";

var buster = require("buster");
var assert = buster.assert;

buster.testCase("hello world", {
    "hello world test": function () {
        assert(true);
    }
});
