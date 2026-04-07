const referee = require("@sinonjs/referee");
const assert = referee.assert;
const refute = referee.refute;
const throwOnFalsyObject = require("../lib/sinon/throw-on-falsy-object");

describe("throwOnFalsyObject", function () {
    it("should throw if property provided and object is null", function () {
        assert.exception(
            function () {
                throwOnFalsyObject(null, "prop");
            },
            { message: "Trying to stub property 'prop' of null" },
        );
    });

    it("should throw if property provided and object is undefined", function () {
        assert.exception(
            function () {
                throwOnFalsyObject(undefined, "prop");
            },
            { message: "Trying to stub property 'prop' of undefined" },
        );
    });

    it("should not throw if property not provided", function () {
        refute.exception(function () {
            throwOnFalsyObject(null);
        });
    });

    it("should not throw if object is provided", function () {
        refute.exception(function () {
            throwOnFalsyObject({}, "prop");
        });
    });
});
