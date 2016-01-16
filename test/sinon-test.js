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

        ".createStubInstance": {
            "stubs existing methods": function () {
                var Class = function () {};
                Class.prototype.method = function () {};

                var stub = sinon.createStubInstance(Class);
                stub.method.returns(3);
                assert.equals(3, stub.method());
            },

            "doesn't stub fake methods": function () {
                var Class = function () {};

                var stub = sinon.createStubInstance(Class);
                assert.exception(function () {
                    stub.method.returns(3);
                });
            },

            "doesn't call the constructor": function () {
                var Class = function (a, b) {
                    var c = a + b;
                    throw c;
                };
                Class.prototype.method = function () {};

                var stub = sinon.createStubInstance(Class);
                refute.exception(function () {
                    stub.method(3);
                });
            },

            "retains non function values": function () {
                var TYPE = "some-value";
                var Class = function () {};
                Class.prototype.type = TYPE;

                var stub = sinon.createStubInstance(Class);
                assert.equals(TYPE, stub.type);
            },

            "has no side effects on the prototype": function () {
                var proto = {
                    method: function () {
                        throw "error";
                    }
                };
                var Class = function () {};
                Class.prototype = proto;

                var stub = sinon.createStubInstance(Class);
                refute.exception(stub.method);
                assert.exception(proto.method);
            },

            "throws exception for non function params": function () {
                var types = [{}, 3, "hi!"];

                for (var i = 0; i < types.length; i++) {
                    // yes, it's silly to create functions in a loop, it's also a test
                    assert.exception(function () { // eslint-disable-line no-loop-func
                        sinon.createStubInstance(types[i]);
                    });
                }
            }
        },

        ".restore": {
            "restores all methods of supplied object": function () {
                var methodA = function () {};
                var methodB = function () {};
                var obj = { methodA: methodA, methodB: methodB };

                sinon.stub(obj);
                sinon.restore(obj);

                assert.same(obj.methodA, methodA);
                assert.same(obj.methodB, methodB);
            },

            "only restores restorable methods": function () {
                var stubbedMethod = function () {};
                var vanillaMethod = function () {};
                var obj = { stubbedMethod: stubbedMethod, vanillaMethod: vanillaMethod };

                sinon.stub(obj, "stubbedMethod");
                sinon.restore(obj);

                assert.same(obj.stubbedMethod, stubbedMethod);
            },

            "restores a single stubbed method": function () {
                var method = function () {};
                var obj = { method: method };

                sinon.stub(obj);
                sinon.restore(obj.method);

                assert.same(obj.method, method);
            }
        }
    });
}(this));
