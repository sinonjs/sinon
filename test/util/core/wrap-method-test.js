"use strict";

var referee = require("referee");
var wrapMethod = require("../../../lib/sinon/util/core/wrap-method");
var createSpy = require("../../../lib/sinon/spy");
var createStub = require("../../../lib/sinon/stub");
var assert = referee.assert;
var refute = referee.refute;

describe("util/core/wrapMethod", function () {
    beforeEach(function () {
        this.method = function () {};
        this.getter = function () {};
        this.setter = function () {};
        this.object = {method: this.method};
        Object.defineProperty(this.object, "property", {
            get: this.getter,
            set: this.setter,
            configurable: true
        });
    });

    it("is function", function () {
        assert.isFunction(wrapMethod);
    });

    it("throws if first argument is not object", function () {
        assert.exception(function () {
            wrapMethod();
        }, "TypeError");
    });

    it("throws if object defines property but is not function", function () {
        this.object.prop = 42;
        var object = this.object;

        assert.exception(function () {
            wrapMethod(object, "prop", function () {});
        }, "TypeError");
    });

    it("throws Symbol() if object defines property but is not function", function () {
        if (typeof Symbol === "function") {
            var symbol = Symbol();
            var object = {};
            object[symbol] = 42;

            assert.exception(function () {
                wrapMethod(object, symbol, function () {});
            }, function (err) {
                return err.message === "Attempted to wrap number property Symbol() as function";
            });
        }
    });

    it("throws if object does not define property", function () {
        var object = this.object;

        assert.exception(function () {
            wrapMethod(object, "prop", function () {});
        });

        try {
            wrapMethod(object, "prop", function () {});
            throw new Error("Didn't throw");
        } catch (e) {
            assert.match(e.message,
                /Attempted to wrap .* property .* as function/);
        }
    });

    it("throws if third argument is missing", function () {
        var object = this.object;

        assert.exception(function () {
            wrapMethod(object, "method");
        }, "TypeError");
    });

    it("throws if third argument is not a function or a property descriptor", function () {
        var object = this.object;

        assert.exception(function () {
            wrapMethod(object, "method", 1);
        }, "TypeError");
    });

    it("replaces object method", function () {
        wrapMethod(this.object, "method", function () {});

        refute.same(this.method, this.object.method);
        assert.isFunction(this.object.method);
    });

    it("replaces getter", function () {
        wrapMethod(this.object, "property", { get: function () {} });

        refute.same(this.getter, Object.getOwnPropertyDescriptor(this.object, "property").get);
        assert.isFunction(Object.getOwnPropertyDescriptor(this.object, "property").get);
    });

    it("replaces setter", function () {
        wrapMethod(this.object, "property", { // eslint-disable-line accessor-pairs
            set: function () {}
        });

        refute.same(this.setter, Object.getOwnPropertyDescriptor(this.object, "property").set);
        assert.isFunction(Object.getOwnPropertyDescriptor(this.object, "property").set);
    });

    it("throws if method is already wrapped", function () {
        wrapMethod(this.object, "method", function () {});

        assert.exception(function () {
            wrapMethod(this.object, "method", function () {});
        }, "TypeError");
    });

    it("throws Symbol if method is already wrapped", function () {
        if (typeof Symbol === "function") {
            var symbol = Symbol();
            var object = {};
            object[symbol] = function () {};
            wrapMethod(object, symbol, function () {});

            assert.exception(function () {
                wrapMethod(object, symbol, function () {});
            }, function (err) {
                return err.message === "Attempted to wrap Symbol() which is already wrapped";
            });
        }
    });

    it("throws if property descriptor is already wrapped", function () {
        wrapMethod(this.object, "property", { get: function () {} });

        assert.exception(function () {
            wrapMethod(this.object, "property", { get: function () {} });
        }, "TypeError");
    });

    it("throws if method is already a spy", function () {
        var object = { method: createSpy() };

        assert.exception(function () {
            wrapMethod(object, "method", function () {});
        }, "TypeError");
    });

    it("throws if Symbol method is already a spy", function () {
        if (typeof Symbol === "function") {
            var symbol = Symbol();
            var object = {};
            object[symbol] = createSpy();

            assert.exception(function () {
                wrapMethod(object, symbol, function () {});
            }, function (err) {
                return err.message === "Attempted to wrap Symbol() which is already spied on";
            });
        }
    });

    var overridingErrorAndTypeError = (function () {
        return !(typeof navigator === "object" && /PhantomJS/.test(navigator.userAgent));
    }());
    if (overridingErrorAndTypeError) {
        describe("originating stack traces", function () {
            beforeEach(function () {
                this.oldError = Error;
                this.oldTypeError = TypeError;

                var i = 0;

                Error = TypeError = function () { // eslint-disable-line no-native-reassign, no-undef
                    this.stack = ":STACK" + ++i + ":";
                };
            });

            afterEach(function () {
                Error = this.oldError; // eslint-disable-line no-native-reassign, no-undef
                TypeError = this.oldTypeError; // eslint-disable-line no-native-reassign, no-undef
            });

            it("throws with stack trace showing original wrapMethod call", function () {
                var object = { method: function () {} };
                wrapMethod(object, "method", function () {
                    return "original";
                });

                try {
                    wrapMethod(object, "method", function () {});
                } catch (e) {
                    assert.equals(e.stack, ":STACK2:\n--------------\n:STACK1:");
                }
            });
        });
    }

    if (typeof window !== "undefined") {
        describe("in browser", function () {
            it("does not throw if object is window object", function () {
                window.sinonTestMethod = function () {};
                try {
                    refute.exception(function () {
                        wrapMethod(window, "sinonTestMethod", function () {});
                    });
                } finally {
                    // IE 8 does not support delete on global properties.
                    window.sinonTestMethod = undefined;
                }
            });
        });
    }

    it("mirrors function properties", function () {
        var object = { method: function () {} };
        object.method.prop = 42;

        wrapMethod(object, "method", function () {});

        assert.equals(object.method.prop, 42);
    });

    it("does not mirror and overwrite existing properties", function () {
        var object = { method: function () {} };
        object.method.called = 42;

        createStub(object, "method");

        assert.isFalse(object.method.called);
    });

    describe("wrapped method", function () {
        beforeEach(function () {
            this.method = function () {};
            this.object = { method: this.method };
        });

        it("defines restore method", function () {
            wrapMethod(this.object, "method", function () {});

            assert.isFunction(this.object.method.restore);
        });

        it("returns wrapper", function () {
            var wrapper = wrapMethod(this.object, "method", function () {});

            assert.same(this.object.method, wrapper);
        });

        it("restore brings back original method", function () {
            wrapMethod(this.object, "method", function () {});
            this.object.method.restore();

            assert.same(this.object.method, this.method);
        });
    });

    describe("wrapped prototype method", function () {
        beforeEach(function () {
            this.type = function () {};
            this.type.prototype.method = function () {};

            this.object = new this.type(); //eslint-disable-line new-cap
        });

        it("wrap adds owned property", function () {
            var wrapper = wrapMethod(this.object, "method", function () {});

            assert.same(this.object.method, wrapper);
            assert(this.object.hasOwnProperty("method"));
        });

        it("restore removes owned property", function () {
            wrapMethod(this.object, "method", function () {});
            this.object.method.restore();

            assert.same(this.object.method, this.type.prototype.method);
            assert.isFalse(this.object.hasOwnProperty("method"));
        });
    });
});
