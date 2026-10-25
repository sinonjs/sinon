const path = require("node:path");
const { rollup } = require("rollup");
const referee = require("@sinonjs/referee");

const assert = referee.assert;

describe("Rollup source entries", function () {
    it("builds every source entry into the matching CommonJS module", async function () {
        this.timeout(10000);
        const { default: config } = await import("../../rollup.config.mjs");
        const bundle = await rollup(config);
        try {
            const { output } = await bundle.generate(config.output);
            const expected = config.input
                .map((entry) =>
                    path
                        .relative(path.resolve("src"), path.resolve(entry))
                        .split(path.sep)
                        .join("/"),
                )
                .sort();
            const actual = output
                .filter((entry) => entry.type === "chunk")
                .map((entry) => entry.fileName)
                .sort();

            assert.equals(actual, expected);
        } finally {
            await bundle.close();
        }
    });
});
