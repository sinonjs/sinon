"use strict";

var referee = require("@sinonjs/referee");
var sinon = require("../../../lib/sinon");
var format = require("../../../lib/sinon/util/core/format");
var assert = referee.assert;

describe("util/core/format", function () {
    describe("format.setFormatter", function () {
        it("sets custom formatter", function () {
            format.setFormatter(function () {
                return "formatted";
            });
            assert.equals(format("Hey"), "formatted");
        });

        it("throws if custom formatter is not a function", function () {
            assert.exception(
                function () {
                    format.setFormatter("foo");
                },
                {
                    message:
                        "format.setFormatter must be called with a function",
                }
            );
        });

        it("exposes method on sinon", function () {
            assert.equals(sinon.setFormatter, format.setFormatter);
        });
    });
});
