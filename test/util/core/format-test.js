"use strict";

var referee = require("@sinonjs/referee");
var sinon = require("../../../lib/sinon");
var format = require("../../../lib/sinon/util/core/format");
var assert = referee.assert;

describe("util/core/format", function() {
    it("formats with formatio by default", function() {
        assert.equals(format({ id: 42 }), "{ id: 42 }");
    });

    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip("should configure formatio to use maximum 250 entries", function() {
        // not sure how we can verify this integration with the current setup
        // where sinon.js calls formatio as part of its loading
        // extracting sinon.format into a separate module would make this a lot
        // easier
    });

    it("formats strings without quotes", function() {
        assert.equals(format("Hey"), "Hey");
    });

    describe("format.setFormatter", function() {
        it("sets custom formatter", function() {
            format.setFormatter(function() {
                return "formatted";
            });
            assert.equals(format("Hey"), "formatted");
        });

        it("throws if custom formatter is not a function", function() {
            assert.exception(
                function() {
                    format.setFormatter("foo");
                },
                {
                    message: "format.setFormatter must be called with a function"
                }
            );
        });

        it("exposes method on sinon", function() {
            assert.equals(sinon.setFormatter, format.setFormatter);
        });
    });
});
