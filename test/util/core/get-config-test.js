"use strict";

var buster = require("buster");
var sinon = require("../../../lib/sinon");
var getConfig = require("../../../lib/sinon/util/core/get-config");
var assert = buster.assert;
var refute = buster.refute;

buster.testCase("core/util/getConfig", {
    ".getConfig": {
        "gets copy of default config": function () {
            var config = getConfig();

            refute.same(config, sinon.defaultConfig);
            assert.equals(config.injectIntoThis, sinon.defaultConfig.injectIntoThis);
            assert.equals(config.injectInto, sinon.defaultConfig.injectInto);
            assert.equals(config.properties, sinon.defaultConfig.properties);
            assert.equals(config.useFakeTimers, sinon.defaultConfig.useFakeTimers);
            assert.equals(config.useFakeServer, sinon.defaultConfig.useFakeServer);
        },

        "should override specified properties": function () {
            var config = getConfig({
                properties: ["stub", "mock"],
                useFakeServer: false
            });

            refute.same(config, sinon.defaultConfig);
            assert.equals(config.injectIntoThis, sinon.defaultConfig.injectIntoThis);
            assert.equals(config.injectInto, sinon.defaultConfig.injectInto);
            assert.equals(config.properties, ["stub", "mock"]);
            assert.equals(config.useFakeTimers, sinon.defaultConfig.useFakeTimers);
            assert.isFalse(config.useFakeServer);
        }
    }
});
