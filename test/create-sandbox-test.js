"use strict";

const createSandbox = require("../lib/sinon/create-sandbox");
const { assert } = require("@sinonjs/referee");

describe("create-sandbox", function () {
    it("can be configured to limit the error message length", function () {
        // Arrange & Act
        const sb = createSandbox({
            assertOptions: {
                shouldLimitAssertionLogs: true,
                assertionLogLimit: 10,
            },
        });

        // Assert
        assert.exception(
            () => sb.assert.fail("1234567890--THIS SHOULD NOT SHOW--"),
            { message: "1234567890" },
        );
    });
});
