(function (root) {
    "use strict";

    var buster = root.buster || require("buster"),
        assert = buster.assert;

    buster.testCase("hello world", {
        "hello world test": function () {
            assert(true);
        }
    });
}(this));
