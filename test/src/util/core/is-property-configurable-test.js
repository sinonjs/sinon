import referee from "@sinonjs/referee";
import isPropertyConfigurable from "../../../../src/sinon/util/core/is-property-configurable.js";

const assert = referee.assert;

describe("is-property-configurable", function () {
    it("returns true when the property is missing", function () {
        const actual = isPropertyConfigurable({}, "missing");

        assert.isTrue(actual);
    });

    it("returns false when the property is not configurable", function () {
        const object = {};

        Object.defineProperty(object, "locked", {
            configurable: false,
            value: 1,
        });

        const actual = isPropertyConfigurable(object, "locked");

        assert.isFalse(actual);
    });
});
