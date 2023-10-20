/* eslint-env mocha */
/* eslint-disable jsdoc/require-jsdoc */
"use strict";

const referee = require("@sinonjs/referee");
const assert = referee.assert;
const refute = referee.refute;

module.exports = function shared(createSpyOrStub) {
    it("replaces all methods of an object when no property is given", function () {
        const obj = {
            func1: function () {
                return;
            },
            func2: function () {
                return;
            },
            func3: function () {
                return;
            },
        };

        createSpyOrStub(obj);

        assert.isFunction(obj.func1.restore);
        assert.isFunction(obj.func2.restore);
        assert.isFunction(obj.func3.restore);
    });

    it("replaces prototype methods", function () {
        function Obj() {
            return;
        }
        Obj.prototype.func1 = function () {
            return;
        };
        const obj = new Obj();

        createSpyOrStub(obj);

        assert.isFunction(obj.func1.restore);
    });

    it("returns object", function () {
        const object = {
            func1: function () {
                return;
            },
        };

        assert.same(createSpyOrStub(object), object);
    });

    it("only replaces functions", function () {
        const object = {
            foo: "bar",
            baz: function () {
                return;
            },
        };

        createSpyOrStub(object);

        assert.equals(object.foo, "bar");
    });

    it("handles non-enumerable properties", function () {
        const obj = {
            func1: function () {
                return;
            },
            func2: function () {
                return;
            },
        };

        Object.defineProperty(obj, "func3", {
            value: function () {
                return;
            },
            writable: true,
            configurable: true,
        });

        createSpyOrStub(obj);

        assert.isFunction(obj.func1.restore);
        assert.isFunction(obj.func2.restore);
        assert.isFunction(obj.func3.restore);
    });

    it("handles non-enumerable properties on prototypes", function () {
        function Obj() {
            return;
        }
        Object.defineProperty(Obj.prototype, "func1", {
            value: function () {
                return;
            },
            writable: true,
            configurable: true,
        });

        const obj = new Obj();

        createSpyOrStub(obj);

        assert.isFunction(obj.func1.restore);
    });

    it("does not replace non-enumerable properties from Object.prototype", function () {
        const obj = {
            noop: function () {
                return;
            },
        };

        createSpyOrStub(obj);

        refute.isFunction(obj.toString.restore);
        refute.isFunction(obj.toLocaleString.restore);
        refute.isFunction(obj.propertyIsEnumerable.restore);
    });

    it("does not fail on overrides", function () {
        const parent = {
            func: function () {
                return;
            },
        };
        const child = Object.create(parent);
        child.func = function () {
            return;
        };

        refute.exception(function () {
            createSpyOrStub(child);
        });
    });

    it("throws on non-existent property", function () {
        const myObj = {
            ignoreme: function () {
                return;
            },
        };

        assert.exception(function () {
            createSpyOrStub(myObj, "ouch");
        });

        assert.isUndefined(myObj.ouch);
    });

    it("throws on data property descriptors that are not writable or configurable", function () {
        const myObj = {};
        Object.defineProperty(myObj, "ignoreme", {
            writable: false,
            configurable: false,
        });

        assert.exception(function () {
            createSpyOrStub(myObj, "ignoreme");
        }, new TypeError("Descriptor for property ignoreme is non-configurable and non-writable"));
    });

    it("throws on accessor property descriptors that are not configurable", function () {
        const myObj = {};
        Object.defineProperty(myObj, "ignoreme", {
            get: function (key) {
                return this[key];
            },
            set: function (key, val) {
                this[key] = val;
            },
            configurable: false,
        });

        assert.exception(function () {
            createSpyOrStub(myObj, "ignoreme");
        }, new TypeError("Descriptor for accessor property ignoreme is non-configurable"));
    });

    it("throws on data descriptors that are not stubbable", function () {
        const myObj = {};
        Object.defineProperty(myObj, "ignoreme", {
            writable: false,
            configurable: false,
        });

        assert.exception(function () {
            createSpyOrStub(myObj, "ignoreme");
        }, new TypeError("Descriptor for data property ignoreme is non-writable"));
    });
};
