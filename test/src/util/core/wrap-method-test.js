import referee from "@sinonjs/referee";
import wrapMethod from "../../../../src/sinon/util/core/wrap-method.js";
import createSpy from "../../../../src/sinon/spy.js";
import createStub from "../../../../src/sinon/stub.js";
import sinonType from "../../../../src/sinon/util/core/sinon-type.js";
const assert = referee.assert;
const refute = referee.refute;

describe("util/core/wrapMethod", function () {
    beforeEach(function () {
        this.method = function () {
            return;
        };
        this.getter = function () {
            return;
        };
        this.setter = function () {
            return;
        };
        this.object = { method: this.method };
        Object.defineProperty(this.object, "property", {
            get: this.getter,
            set: this.setter,
            configurable: true,
        });
    });

    it("is function", function () {
        assert.isFunction(wrapMethod);
    });

    it("throws if first argument is not object", function () {
        assert.exception(
            function () {
                wrapMethod();
            },
            { name: "TypeError" },
        );
    });

    it("throws if object defines property but is not function", function () {
        this.object.prop = 42;
        const object = this.object;

        assert.exception(
            function () {
                wrapMethod(object, "prop", function () {
                    return;
                });
            },
            { name: "TypeError" },
        );
    });

    it("throws Symbol() if object defines property but is not function", function () {
        if (typeof Symbol !== "function") {
            this.skip();
        }

        const symbol = Symbol("apple pie");
        const object = {};
        object[symbol] = 42;

        assert.exception(
            function () {
                wrapMethod(object, symbol, function () {
                    return;
                });
            },
            function (err) {
                return (
                    err.message ===
                    "Attempted to wrap number property Symbol(apple pie) as function"
                );
            },
        );
    });

    it("throws if object does not define property", function () {
        const object = this.object;

        assert.exception(function () {
            wrapMethod(object, "prop", function () {
                return;
            });
        });

        assert.exception(
            function () {
                wrapMethod(object, "prop", function () {
                    return;
                });
            },
            {
                message: /Attempted to wrap .* property .* as function/,
            },
        );
    });

    it("throws if third argument is missing", function () {
        const object = this.object;

        assert.exception(
            function () {
                wrapMethod(object, "method");
            },
            { name: "TypeError" },
        );
    });

    it("throws if third argument is not a function or a property descriptor", function () {
        const object = this.object;

        assert.exception(
            function () {
                wrapMethod(object, "method", 1);
            },
            { name: "TypeError" },
        );
    });

    it("replaces object method", function () {
        wrapMethod(this.object, "method", function () {
            return;
        });

        refute.same(this.method, this.object.method);
        assert.isFunction(this.object.method);
    });

    it("replaces getter", function () {
        wrapMethod(this.object, "property", {
            get: function () {
                return;
            },
        });

        refute.same(
            this.getter,
            Object.getOwnPropertyDescriptor(this.object, "property").get,
        );
        assert.isFunction(
            Object.getOwnPropertyDescriptor(this.object, "property").get,
        );
    });

    it("replaces setter", function () {
        wrapMethod(this.object, "property", {
            set: function () {
                return;
            },
        });

        refute.same(
            this.setter,
            Object.getOwnPropertyDescriptor(this.object, "property").set,
        );
        assert.isFunction(
            Object.getOwnPropertyDescriptor(this.object, "property").set,
        );
    });

    it("throws if method is already wrapped", function () {
        wrapMethod(this.object, "method", function () {
            return;
        });

        assert.exception(
            function () {
                wrapMethod(this.object, "method", function () {
                    return;
                });
            },
            { name: "TypeError" },
        );
    });

    it("throws Symbol if method is already wrapped", function () {
        if (typeof Symbol !== "function") {
            this.skip();
        }

        const symbol = Symbol("apple pie");
        const object = {};
        object[symbol] = function () {
            return;
        };
        wrapMethod(object, symbol, function () {
            return;
        });

        assert.exception(
            function () {
                wrapMethod(object, symbol, function () {
                    return;
                });
            },
            function (err) {
                return (
                    err.message ===
                    "Attempted to wrap Symbol(apple pie) which is already wrapped"
                );
            },
        );
    });

    it("throws if property descriptor is already wrapped", function () {
        wrapMethod(this.object, "property", {
            get: function () {
                return;
            },
        });

        assert.exception(
            function () {
                wrapMethod(this.object, "property", {
                    get: function () {
                        return;
                    },
                });
            },
            { name: "TypeError" },
        );
    });

    it("throws if method is already a spy", function () {
        const object = { method: createSpy() };

        assert.exception(
            function () {
                wrapMethod(object, "method", function () {
                    return;
                });
            },
            { name: "TypeError" },
        );
    });

    it("throws if Symbol method is already a spy", function () {
        if (typeof Symbol !== "function") {
            this.skip();
        }

        const symbol = Symbol("apple pie");
        const object = {};
        object[symbol] = createSpy();

        assert.exception(
            function () {
                wrapMethod(object, symbol, function () {
                    return;
                });
            },
            function (err) {
                return (
                    err.message ===
                    "Attempted to wrap Symbol(apple pie) which is already spied on"
                );
            },
        );
    });

    describe("originating stack traces", function () {
        beforeEach(function () {
            this.oldError = Error;
            this.oldTypeError = TypeError;

            let i = 0;

            globalThis.Error = globalThis.TypeError = function () {
                this.stack = `:STACK${++i}:`;
            };
        });

        afterEach(function () {
            globalThis.Error = this.oldError;
            globalThis.TypeError = this.oldTypeError;
        });

        it("throws with stack trace showing original wrapMethod call", function () {
            const object = {
                method: function () {
                    return;
                },
            };
            wrapMethod(object, "method", function () {
                return "original";
            });

            assert.exception(
                function () {
                    wrapMethod(object, "method", function () {
                        return;
                    });
                },
                {
                    stack: ":STACK2:\n--------------\n:STACK1:",
                },
            );
        });
    });

    describe("in browser", function () {
        before(function () {
            if (typeof window === "undefined") {
                this.skip();
            }
        });

        it("does not throw if object is window object", function () {
            window.sinonTestMethod = function () {
                return;
            };
            refute.exception(function () {
                wrapMethod(window, "sinonTestMethod", function () {
                    return;
                });
            });
        });
    });

    it("mirrors function properties", function () {
        const object = {
            method: function () {
                return;
            },
        };
        object.method.prop = 42;

        wrapMethod(object, "method", function () {
            return;
        });

        assert.equals(object.method.prop, 42);
    });

    it("does not mirror and overwrite existing properties", function () {
        const object = {
            method: function () {
                return;
            },
        };
        object.method.called = 42;

        createStub(object, "method");

        assert.isFalse(object.method.called);
    });

    describe("wrapped method", function () {
        beforeEach(function () {
            this.method = function () {
                return;
            };
            this.object = { method: this.method };
        });

        it("defines restore method", function () {
            wrapMethod(this.object, "method", function () {
                return;
            });

            assert.isFunction(this.object.method.restore);
        });

        it("returns wrapper", function () {
            const wrapper = wrapMethod(this.object, "method", function () {
                return;
            });

            assert.same(this.object.method, wrapper);
        });

        it("restore brings back original method", function () {
            wrapMethod(this.object, "method", function () {
                return;
            });
            this.object.method.restore();

            assert.same(this.object.method, this.method);
        });
    });

    describe("wrapped prototype method", function () {
        beforeEach(function () {
            this.type = function () {
                return;
            };
            this.type.prototype.method = function () {
                return;
            };

            this.object = new this.type(); //eslint-disable-line new-cap
        });

        it("wrap adds owned property", function () {
            const wrapper = wrapMethod(this.object, "method", function () {
                return;
            });

            assert.same(this.object.method, wrapper);
            assert(this.object.hasOwnProperty("method"));
        });

        it("restore removes owned property", function () {
            wrapMethod(this.object, "method", function () {
                return;
            });
            this.object.method.restore();

            assert.same(this.object.method, this.type.prototype.method);
            assert.isFalse(this.object.hasOwnProperty("method"));
        });

        it("restore removes a shadowed method that came from the prototype", function () {
            const wrapper = wrapMethod(this.object, "method", function () {
                return "wrapped";
            });

            assert.same(this.object.method, wrapper);
            assert.equals(this.object.method(), "wrapped");

            this.object.method.restore();

            assert.same(this.object.method, this.type.prototype.method);
            assert.isFalse(this.object.hasOwnProperty("method"));
        });
    });

    describe("stub-instance restoration", function () {
        it("should set property to noop if object is a stub-instance", function () {
            const object = {
                method: function method() {
                    return undefined;
                },
            };
            sinonType.set(object, "stub-instance");

            const originalMethod = object.method;
            wrapMethod(object, "method", function noop() {
                return undefined;
            });
            object.method.restore();

            assert.isFunction(object.method);
            refute.same(object.method, originalMethod);
            // It should be a noop function (empty function)
        });
    });

    describe("accessor restoration", function () {
        beforeEach(function () {
            this.object = {};
            /* eslint-disable accessor-pairs */
            Object.defineProperty(this.object, "getter", {
                get: function getter() {
                    return "original-getter";
                },
                configurable: true,
                enumerable: true,
            });
            Object.defineProperty(this.object, "setter", {
                set: function setter(value) {
                    this.setterValue = value;
                },
                configurable: true,
                enumerable: true,
            });
            /* eslint-enable accessor-pairs */
        });

        it("restores wrapped getter descriptors", function () {
            const wrapper = wrapMethod(this.object, "getter", {
                get: function getterReplacement() {
                    return "replacement-getter";
                },
            });

            assert.isFunction(wrapper.restore);
            wrapper.restore();

            assert.equals(this.object.getter, "original-getter");
        });

        it("restores wrapped setter descriptors", function () {
            const wrapper = wrapMethod(this.object, "setter", {
                set: function setterReplacement(value) {
                    this.wrappedSetterValue = value;
                },
            });

            assert.isFunction(wrapper.restore);
            wrapper.restore();

            this.object.setter = "restored";
            assert.equals(this.object.setterValue, "restored");
            refute.equals(this.object.wrappedSetterValue, "restored");
        });
    });
});
