// sinon.js doesn't overwrite the global and returns a different version than the one provided by BusterJS
define(["../../lib/sinon"], function (targetSinon) {

    var assert = buster.assert,
        refute = buster.refute;

    // This test case is not about testing individual modules, but only here
    // to verify that the API is correctly assembled when loaded with an AMD loader in async
    // mode (script tags), in this case using RequireJS
    buster.testCase("Verify API for AMD compatibility - source version", {

        sinon: {
            "must not be same as BusterJS' bundled version": function () {
                targetSinon.bogusProperty = "some bogus value";
                assert.defined(targetSinon.bogusProperty);
                refute.defined(sinon.bogusProperty);
            },

            // see http://sinonjs.org/docs/#spies
            spies: {
                "spy method": {
                    "should be a Function": function () {
                        assert.isFunction(targetSinon.spy);
                    }
                }
            },

            // see http://sinonjs.org/docs/#stubs
            stubs: {
                "stub method": {
                    "should be a function": function () {
                        assert.isFunction(targetSinon.stub);
                    }
                }
            },

            // see http://sinonjs.org/docs/#mocks
            mocks: {
                "mock method": {
                    "should be a Function": function () {
                        assert.isFunction(targetSinon.mock);
                    }
                }
            },

            // see http://sinonjs.org/docs/#clock
            "fake timers": {
                "useFakeTimers method": {
                    "should be a Function": function () {
                        assert.isFunction(targetSinon.useFakeTimers);
                    }
                }
            },

            // see http://sinonjs.org/docs/#server
            "fake XHR and server": {
                "useFakeXMLHttpRequest method": {
                    "should be a Function": function () {
                        assert.isFunction(targetSinon.useFakeXMLHttpRequest);
                    }
                }
            },

            assertions: {
                "assertion property": {
                    "should be an Object": function () {
                        assert.isObject(targetSinon.assert);
                    }
                }
            },

            matchers: {
                "match method": {
                    "should be a function": function () {
                        assert.isFunction(targetSinon.match);
                    }
                }
            }
        }
    });
});
