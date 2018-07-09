"use strict";

var assert = require("@sinonjs/referee").assert;
var functionName = require("../../../lib/sinon/util/core/function-name");

describe("function-name", function () {
    it("should use displayName by default", function () {
        var fn = {displayName: new Date()};

        assert.equals(functionName(fn), fn.displayName);
    });

    it("should use name if displayName is not available", function () {
        var fn = {name: new Date()};

        assert.equals(functionName(fn), fn.name);
    });

    it("should fallback to string parsing", function () {
        var name = "fn" + new Date().getTime();
        var fn = {
            toString: function () {
                return "\nfunction " + name;
            }
        };

        assert.equals(functionName(fn), name);
    });
});
