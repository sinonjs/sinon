import referee from "@sinonjs/referee";
import Colorizer from "../../../../src/sinon/colorizer.js";

const assert = referee.assert;

const colors = [
    { name: "bold", code: 1 },
    { name: "cyan", code: 96 },
    { name: "green", code: 32 },
    { name: "red", code: 31 },
    { name: "white", code: 39 },
];

describe("color", function () {
    describe("when using the default color support detection", function () {
        it("should return a string", function () {
            const color = new Colorizer();
            const actual = color.red("lorem ipsum");

            assert.equals(typeof actual, "string");
            assert.contains(actual, "lorem ipsum");
        });
    });

    describe("when process.stdout is present", function () {
        it("should inspect stdout tty state", function () {
            const originalProcess = globalThis.process;

            try {
                globalThis.process = {
                    stdout: {
                        isTTY: true,
                    },
                };

                const color = new Colorizer();
                const actual = color.red("lorem ipsum");

                assert.contains(actual, "31m");
            } finally {
                globalThis.process = originalProcess;
            }
        });
    });

    describe("when environment supports color", function () {
        let color;

        beforeEach(function () {
            color = new Colorizer({
                stdout: true,
            });
        });

        // eslint-disable-next-line mocha/no-setup-in-describe
        colors.forEach(function (method) {
            // eslint-disable-next-line mocha/no-setup-in-describe
            describe(method.name, function () {
                it("should return a colored string", function () {
                    const string = "lorem ipsum";
                    const actual = color[method.name](string);

                    assert.contains(actual, `${method.code}m${string}`);
                });
            });
        });
    });

    describe("when environment does not support color", function () {
        let color;

        beforeEach(function () {
            color = new Colorizer({
                stdout: false,
            });
        });

        // eslint-disable-next-line mocha/no-setup-in-describe
        colors.forEach(function (method) {
            // eslint-disable-next-line mocha/no-setup-in-describe
            describe(method.name, function () {
                it("should return a regular string", function () {
                    const string = "lorem ipsum";
                    const actual = color[method.name](string);

                    assert.equals(actual, string);
                });
            });
        });
    });
});
