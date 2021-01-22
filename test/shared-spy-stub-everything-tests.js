"use strict";

var referee = require("@sinonjs/referee");
var assert = referee.assert;
var refute = referee.refute;

module.exports = function shared(createSpyOrStub) {
    it("replaces all methods of an object when no property is given", function () {
        var obj = {
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
        var obj = new Obj();

        createSpyOrStub(obj);

        assert.isFunction(obj.func1.restore);
    });

    it("returns object", function () {
        var object = {
            func1: function () {
                return;
            },
        };

        assert.same(createSpyOrStub(object), object);
    });

    it("only replaces functions", function () {
        var object = {
            foo: "bar",
            baz: function () {
                return;
            },
        };

        createSpyOrStub(object);

        assert.equals(object.foo, "bar");
    });

    it("handles non-enumerable properties", function () {
        var obj = {
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

        var obj = new Obj();

        createSpyOrStub(obj);

        assert.isFunction(obj.func1.restore);
    });

    it("does not replace non-enumerable properties from Object.prototype", function () {
        var obj = {
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
        var parent = {
            func: function () {
                return;
            },
        };
        var child = Object.create(parent);
        child.func = function () {
            return;
        };

        refute.exception(function () {
            createSpyOrStub(child);
        });
    });

    it("throws on non-existent property", function () {
        var myObj = {
            ignoreme: function () {
                return;
            },
        };

        assert.exception(function () {
            createSpyOrStub(myObj, "ouch");
        });

        assert.isUndefined(myObj.ouch);
    });
};
