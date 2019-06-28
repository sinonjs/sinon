"use strict";

var referee = require("@sinonjs/referee");
var assert = referee.assert;
var exportAsyncBehaviors = require("../../../lib/sinon/util/core/export-async-behaviors");

describe("util/core/exportAsyncBehaviors", function() {
    describe("for methods with names starting with 'callsArg' or 'yields'", function() {
        it("should create an async version", function() {
            var methods = {
                yieldsOn: function yieldsOn() {
                    return "2";
                },
                callsArg: function callsArg() {
                    return "3";
                }
            };
            assert.equals(Object.keys(exportAsyncBehaviors(methods)), ["yieldsOnAsync", "callsArgAsync"]);
        });
    });

    describe("for methods with names not starting with 'callsArg' or 'yields'", function() {
        it("should not add any new methods", function() {
            var methods = {
                callsFake: function callsFake() {
                    return "1";
                },
                resolvesThisAsync: function resolvesThisAsync() {
                    return "4";
                }
            };
            assert.equals(Object.keys(exportAsyncBehaviors(methods)), []);
        });
    });
});
