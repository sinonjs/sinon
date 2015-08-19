// this is a very simple testcase primarily used for debugging
// issues with the AMD setup
(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var assert = buster.assert;

    buster.testCase("hello world", {
        "hello world test": function () {
            assert(true);
        }
    });
}(this));
