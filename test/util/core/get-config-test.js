"use strict";

var referee = require("@sinonjs/referee");
var getConfig = require("../../../lib/sinon/util/core/get-config");
var defaultConfig = require("../../../lib/sinon/util/core/default-config");
var assert = referee.assert;
var refute = referee.refute;

describe("core/util/getConfig", function() {
    describe(".getConfig", function() {
        it("gets copy of default config", function() {
            var config = getConfig();

            refute.same(config, defaultConfig);
            assert.equals(config.injectIntoThis, defaultConfig.injectIntoThis);
            assert.equals(config.injectInto, defaultConfig.injectInto);
            assert.equals(config.properties, defaultConfig.properties);
            assert.equals(config.useFakeTimers, defaultConfig.useFakeTimers);
            assert.equals(config.useFakeServer, defaultConfig.useFakeServer);
        });

        it("should override specified properties", function() {
            var config = getConfig({
                properties: ["stub", "mock"],
                useFakeServer: false
            });

            refute.same(config, defaultConfig);
            assert.equals(config.injectIntoThis, defaultConfig.injectIntoThis);
            assert.equals(config.injectInto, defaultConfig.injectInto);
            assert.equals(config.properties, ["stub", "mock"]);
            assert.equals(config.useFakeTimers, defaultConfig.useFakeTimers);
            assert.isFalse(config.useFakeServer);
        });
    });
});
