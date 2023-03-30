"use strict";

const assert = require("@sinonjs/referee").assert;
const proxyquire = require("proxyquire");

const colors = [
    { name: "bold", code: 1 },
    { name: "cyan", code: 96 },
    { name: "green", code: 32 },
    { name: "red", code: 31 },
    { name: "white", code: 39 },
];

describe("color", function () {
    describe("when environment supports color", function () {
        let color;

        beforeEach(function () {
            color = proxyquire("../../../lib/sinon/color", {
                "supports-color": {
                    stdout: true,
                },
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
            color = proxyquire("../../../lib/sinon/color", {
                "supports-color": {
                    stdout: false,
                },
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
