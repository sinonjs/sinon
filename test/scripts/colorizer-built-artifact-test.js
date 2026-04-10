const referee = require("@sinonjs/referee");
const Colorizer = require("../../lib/sinon/colorizer");

const assert = referee.assert;

describe("colorizer built artifact", function () {
    it("loads and colorizes without throwing", function () {
        const color = new Colorizer();
        const actual = color.red("lorem ipsum");

        assert.equals(typeof actual, "string");
        assert.contains(actual, "lorem ipsum");
    });
});
