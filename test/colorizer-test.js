const referee = require("@sinonjs/referee");
const assert = referee.assert;
const Colorizer = require("../lib/sinon/colorizer");

describe("Colorizer", function () {
    it("should return same string if color is not supported", function () {
        const colorizer = new Colorizer({ stdout: false });
        assert.equals(colorizer.red("test"), "test");
    });

    it("should return colorized string if color is supported", function () {
        const colorizer = new Colorizer({ stdout: true });
        assert.equals(colorizer.red("test"), "\x1b[31mtest\x1b[0m");
    });

    it("should support green", function () {
        const colorizer = new Colorizer({ stdout: true });
        assert.equals(colorizer.green("test"), "\x1b[32mtest\x1b[0m");
    });

    it("should support cyan", function () {
        const colorizer = new Colorizer({ stdout: true });
        assert.equals(colorizer.cyan("test"), "\x1b[96mtest\x1b[0m");
    });

    it("should support white", function () {
        const colorizer = new Colorizer({ stdout: true });
        assert.equals(colorizer.white("test"), "\x1b[39mtest\x1b[0m");
    });

    it("should support bold", function () {
        const colorizer = new Colorizer({ stdout: true });
        assert.equals(colorizer.bold("test"), "\x1b[1mtest\x1b[0m");
    });
});
