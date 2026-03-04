require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const { assert } = require("@sinonjs/referee");

it("should allow limiting the length of the assert.fake output", function () {
    const sb = sinon.createSandbox({
        assertOptions: {
            shouldLimitAssertionLogs: true,
            assertionLogLimit: 10,
        },
    });
    const reallyLongErrorMessage = "a long string repeated 100 times".repeat(
        100,
    );

    assert.exception(
        () => {
            sb.assert.fail(reallyLongErrorMessage);
        },
        {
            message: "a long str",
        },
    );
});
