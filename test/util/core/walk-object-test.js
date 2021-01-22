"use strict";

var referee = require("@sinonjs/referee");

var walkObject = require("../../../lib/sinon/util/core/walk-object");

var assert = referee.assert;

describe("util/core/walk-object", function () {
    // IE11
    describe("without function.name support", function () {
        function fnWithNoName() {
            return;
        }
        var anonymousFn = function () {
            return;
        };

        before(function () {
            if (
                typeof Object.defineProperty !== "function" ||
                typeof Object.getOwnPropertyDescriptor !== "function" ||
                (Object.getOwnPropertyDescriptor(fnWithNoName, "name") || {})
                    .configurable !== true
            ) {
                this.skip();
            }

            var descriptor = { value: undefined };

            Object.defineProperty(anonymousFn, "name", descriptor);
            Object.defineProperty(fnWithNoName, "name", descriptor);
        });

        it("should still identify functions in environments", function () {
            assert.exception(
                function () {
                    walkObject(fnWithNoName, false);
                },
                { message: "Trying to fnWithNoName object but received false" }
            );

            assert.exception(
                function () {
                    walkObject(fnWithNoName, {});
                },
                {
                    message:
                        "Expected to fnWithNoName methods on object but found none",
                }
            );
        });

        it("should work with anonymous functions", function () {
            assert.exception(
                function () {
                    walkObject(anonymousFn, false);
                },
                { message: "Trying to undefined object but received false" }
            );

            assert.exception(
                function () {
                    walkObject(anonymousFn, {});
                },
                {
                    message:
                        "Expected to undefined methods on object but found none",
                }
            );
        });
    });
});
