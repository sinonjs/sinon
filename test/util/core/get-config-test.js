"use strict";

const referee = require("@sinonjs/referee");
const getConfig = require("../../get-config");
const defaultConfig = require("../../../lib/sinon/util/core/default-config");
const assert = referee.assert;
const refute = referee.refute;

describe("core/util/getConfig", function () {
    describe(".getConfig", function () {
        it("gets copy of default config", function () {
            const config = getConfig();

            refute.same(config, defaultConfig);
            assert.equals(config.injectInto, defaultConfig.injectInto);
            assert.equals(config.properties, defaultConfig.properties);
            assert.equals(config.useFakeTimers, defaultConfig.useFakeTimers);
            assert.equals(config.useFakeServer, defaultConfig.useFakeServer);
        });

        it("should override specified properties", function () {
            const config = getConfig({
                properties: ["stub", "mock"],
                useFakeServer: false,
            });

            refute.same(config, defaultConfig);
            assert.equals(config.injectInto, defaultConfig.injectInto);
            assert.equals(config.properties, ["stub", "mock"]);
            assert.equals(config.useFakeTimers, defaultConfig.useFakeTimers);
            assert.isFalse(config.useFakeServer);
        });
    });
});
