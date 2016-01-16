(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var sinon = root.sinon || require("../lib/sinon");
    var assert = buster.assert;
    var refute = buster.refute;

    buster.testCase("sinon", {

        ".log": {
            "does nothing gracefully": function () {
                refute.exception(function () {
                    sinon.log("Oh, hiya");
                });
            }
        },

    });
}(this));
