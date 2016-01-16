(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var sinon = root.sinon || require("../lib/sinon");
    var assert = buster.assert;
    var refute = buster.refute;

    buster.testCase("sinon", {

        "Function.prototype.toString": {
            "returns function's displayName property": function () {
                var fn = function () {};
                fn.displayName = "Larry";

                assert.equals(sinon.functionToString.call(fn), "Larry");
            },

            "guesses name from last call's this object": function () {
                var obj = {};
                obj.doStuff = sinon.spy();
                obj.doStuff.call({});
                obj.doStuff();

                assert.equals(sinon.functionToString.call(obj.doStuff), "doStuff");
            },

            "guesses name from any call where property can be located": function () {
                var obj = {};
                var otherObj = { id: 42 };

                obj.doStuff = sinon.spy();
                obj.doStuff.call({});
                obj.doStuff();
                obj.doStuff.call(otherObj);

                assert.equals(sinon.functionToString.call(obj.doStuff), "doStuff");
            }
        },

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
        },

        ".log": {
            "does nothing gracefully": function () {
                refute.exception(function () {
                    sinon.log("Oh, hiya");
                });
            }
        },

    });
}(this));
