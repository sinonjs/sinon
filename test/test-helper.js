"use strict";

var referee = require("@sinonjs/referee");

referee.add("spy", {
    assert: function(obj) {
        return obj !== null && typeof obj.calledWith === "function" && !obj.returns;
    },
    assertMessage: "Expected object ${0} to be a spy function",
    refuteMessage: "Expected object ${0} not to be a spy function"
});

referee.add("stub", {
    assert: function(obj) {
        return obj !== null && typeof obj.calledWith === "function" && typeof obj.returns === "function";
    },
    assertMessage: "Expected object ${0} to be a stub function",
    refuteMessage: "Expected object ${0} not to be a stub function"
});

referee.add("mock", {
    assert: function(obj) {
        return obj !== null && typeof obj.verify === "function" && typeof obj.expects === "function";
    },
    assertMessage: "Expected object ${0} to be a mock",
    refuteMessage: "Expected object ${0} not to be a mock"
});

referee.add("fakeServer", {
    assert: function(obj) {
        return (
            obj !== null &&
            Object.prototype.toString.call(obj.requests) === "[object Array]" &&
            typeof obj.respondWith === "function"
        );
    },
    assertMessage: "Expected object ${0} to be a fake server",
    refuteMessage: "Expected object ${0} not to be a fake server"
});

referee.add("clock", {
    assert: function(obj) {
        return obj !== null && typeof obj.tick === "function" && typeof obj.setTimeout === "function";
    },
    assertMessage: "Expected object ${0} to be a clock",
    refuteMessage: "Expected object ${0} not to be a clock"
});
