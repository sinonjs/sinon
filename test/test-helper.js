(function (root) {
    "use strict";
    var buster = root.buster || require("buster");

    buster.referee.add("spy", {
        assert: function (obj) {
            return obj !== null && typeof obj.calledWith === "function" && !obj.returns;
        },
        assertMessage: "Expected object ${0} to be a spy function"
    });

    buster.referee.add("stub", {
        assert: function (obj) {
            return obj !== null &&
                typeof obj.calledWith === "function" &&
                typeof obj.returns === "function";
        },
        assertMessage: "Expected object ${0} to be a stub function"
    });

    buster.referee.add("mock", {
        assert: function (obj) {
            return obj !== null &&
                typeof obj.verify === "function" &&
                typeof obj.expects === "function";
        },
        assertMessage: "Expected object ${0} to be a mock"
    });

    buster.referee.add("fakeServer", {
        assert: function (obj) {
            return obj !== null &&
                Object.prototype.toString.call(obj.requests) === "[object Array]" &&
                typeof obj.respondWith === "function";
        },
        assertMessage: "Expected object ${0} to be a fake server"
    });

    buster.referee.add("clock", {
        assert: function (obj) {
            return obj !== null &&
                typeof obj.tick === "function" &&
                typeof obj.setTimeout === "function";
        },
        assertMessage: "Expected object ${0} to be a clock"
    });
}(this));
