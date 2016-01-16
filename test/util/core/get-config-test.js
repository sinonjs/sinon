(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var sinon = root.sinon || require("../../../lib/sinon");
    var assert = buster.assert;
    var refute = buster.refute;

    buster.testCase("sinon.getConfig", {
        ".getConfig": {
            "gets copy of default config": function () {
                var config = sinon.getConfig();

                refute.same(config, sinon.defaultConfig);
                assert.equals(config.injectIntoThis, sinon.defaultConfig.injectIntoThis);
                assert.equals(config.injectInto, sinon.defaultConfig.injectInto);
                assert.equals(config.properties, sinon.defaultConfig.properties);
                assert.equals(config.useFakeTimers, sinon.defaultConfig.useFakeTimers);
                assert.equals(config.useFakeServer, sinon.defaultConfig.useFakeServer);
            },

            "should override specified properties": function () {
                var config = sinon.getConfig({
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
}(this));
