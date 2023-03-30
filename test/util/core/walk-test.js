"use strict";

const referee = require("@sinonjs/referee");
const walk = require("../../../lib/sinon/util/core/walk");
const createSpy = require("../../../lib/sinon/spy");
const assert = referee.assert;

describe("util/core/walk", function () {
    it("should call iterator with value, key, and obj, with context as the receiver", function () {
        const target = Object.create(null);
        const rcvr = {};
        const iterator = createSpy();

        target.hello = "world";
        target.foo = 15;

        walk(target, iterator, rcvr);

        assert(iterator.calledTwice);
        assert(iterator.alwaysCalledOn(rcvr));
        assert(iterator.calledWithExactly("hello", target));
        assert(iterator.calledWithExactly("foo", target));
    });

    it("should work with non-enumerable properties", function () {
        const target = Object.create(null);
        const iterator = createSpy();

        target.hello = "world";
        Object.defineProperty(target, "foo", {
            value: 15,
        });

        walk(target, iterator);

        assert(iterator.calledTwice);
        assert(iterator.calledWith("hello"));
        assert(iterator.calledWith("foo"));
    });

    it("should walk the prototype chain of an object", function () {
        const parentProto = Object.create(null, {
            nonEnumerableParentProp: {
                value: "non-enumerable parent prop",
            },
            enumerableParentProp: {
                value: "enumerable parent prop",
                enumerable: true,
            },
        });

        const proto = Object.create(parentProto, {
            nonEnumerableProp: {
                value: "non-enumerable prop",
            },
            enumerableProp: {
                value: "enumerable prop",
                enumerable: true,
            },
        });

        const target = Object.create(proto, {
            nonEnumerableOwnProp: {
                value: "non-enumerable own prop",
            },
            enumerableOwnProp: {
                value: "enumerable own prop",
                enumerable: true,
            },
        });

        const iterator = createSpy();

        walk(target, iterator);

        assert.equals(iterator.callCount, 6);
        assert(iterator.calledWith("nonEnumerableOwnProp", target));
        assert(iterator.calledWith("enumerableOwnProp", target));
        assert(iterator.calledWith("nonEnumerableProp", proto));
        assert(iterator.calledWith("enumerableProp", proto));
        assert(iterator.calledWith("nonEnumerableParentProp", parentProto));
        assert(iterator.calledWith("enumerableParentProp", parentProto));
    });

    it("should not invoke getters on the original receiving object", function () {
        const Target = function Target() {
            return;
        };
        const getter = createSpy();
        Object.defineProperty(Target.prototype, "computedFoo", {
            enumerable: true,
            get: getter,
        });
        const target = new Target();
        const iterator = createSpy();

        walk(target, iterator);

        assert(iterator.calledWith("computedFoo", target));
        assert(getter.notCalled);
    });

    it("should fall back to for..in if getOwnPropertyNames is not available", function () {
        const getOwnPropertyNames = Object.getOwnPropertyNames;
        const Target = function Target() {
            this.hello = "world";
        };
        const target = new Target();
        const rcvr = {};
        const iterator = createSpy();
        let err = null;
        let numCalls = 0;
        let placeholder;

        Target.prototype.foo = 15;
        Object.getOwnPropertyNames = null;

        // Different environments may be inconsistent in how they handle for..in, therefore we
        // use it to track the number of expected calls, rather than setting it to a hard
        // number.
        /* eslint-disable guard-for-in, no-unused-vars */
        for (placeholder in target) {
            numCalls++;
        }
        /* eslint-enable guard-for-in, no-unused-vars */

        // eslint-disable-next-line no-restricted-syntax
        try {
            walk(target, iterator, rcvr);
            assert.equals(iterator.callCount, numCalls);
            assert(iterator.alwaysCalledOn(rcvr));
            assert(iterator.calledWith("world", "hello"));
            assert(iterator.calledWith(15, "foo"));
        } catch (e) {
            err = e;
        } finally {
            Object.getOwnPropertyNames = getOwnPropertyNames;
        }

        assert.isNull(
            err,
            `walk tests failed with message '${err && err.message}'`
        );
    });

    it("does not walk the same property twice", function () {
        const parent = {
            func: function parentFunc() {
                return;
            },
        };
        const child = Object.create(parent);
        child.func = function childFunc() {
            return;
        };
        const iterator = createSpy();

        walk(child, iterator);

        const propertyNames = iterator.args.map(function (call) {
            return call[0];
        });

        // make sure that each property name only exists once
        propertyNames.forEach(function (name, index) {
            assert.equals(index, propertyNames.lastIndexOf(name));
        });
    });
});
