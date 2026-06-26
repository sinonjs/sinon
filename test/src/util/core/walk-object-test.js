import referee from "@sinonjs/referee";
import { walkObjectStrict } from "../../../../src/sinon/util/core/walk-object.js";

const assert = referee.assert;

describe("util/core/walk-object", function () {
    // IE11
    describe("without function.name support", function () {
        function fnWithNoName() {
            return;
        }
        const anonymousFn = function () {
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

            const descriptor = { value: undefined };

            Object.defineProperty(anonymousFn, "name", descriptor);
            Object.defineProperty(fnWithNoName, "name", descriptor);
        });

        it("should still identify functions in environments", function () {
            assert.exception(
                function () {
                    walkObjectStrict(fnWithNoName, false);
                },
                { message: "Trying to fnWithNoName object but received false" },
            );

            assert.exception(
                function () {
                    walkObjectStrict(fnWithNoName, {});
                },
                {
                    message:
                        "Found no methods on object to which we could apply mutations",
                },
            );
        });

        it("should work with anonymous functions", function () {
            assert.exception(
                function () {
                    walkObjectStrict(anonymousFn, false);
                },
                { message: "Trying to undefined object but received false" },
            );

            assert.exception(
                function () {
                    walkObjectStrict(anonymousFn, {});
                },
                {
                    message:
                        "Found no methods on object to which we could apply mutations",
                },
            );
        });
    });
});
