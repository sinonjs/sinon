"use strict";

const sinonAssert = require("../lib/sinon/assert");
const createSandbox = require("../lib/sinon/create-sandbox");

describe("create-sandbox", function () {
    it("passes on options to the creation of the assert object", function () {
        // Arrange
        const sb = createSandbox();
        const spy = sb.spy();
        sb.replace(sinonAssert, "createAssertObject", spy);

        // Act
        createSandbox({
            assertOptions: {
                shouldLimitAssertionLogs: true,
                assertionLogLimit: 1234,
            },
        });

        // Assert
        sb.assert.calledWith(
            spy,
            sb.match({
                shouldLimitAssertionLogs: true,
                assertionLogLimit: 1234,
            }),
        );
        sb.restore();
    });
});
