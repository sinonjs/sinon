"use strict";

var buster = require("buster");
var sinon = require("../../../lib/sinon");
var assert = buster.assert;

buster.testCase("sinon.restore", {
    "restores all methods of supplied object": function () {
        var methodA = function () {};
        var methodB = function () {};
        var nonEnumerableMethod = function () {};
        var obj = { methodA: methodA, methodB: methodB, nonEnumerableMethod: nonEnumerableMethod };
        Object.defineProperty(obj, "nonEnumerableMethod", {
            enumerable: false
        });

        sinon.stub(obj);
        sinon.restore(obj);

        assert.same(obj.methodA, methodA);
        assert.same(obj.methodB, methodB);
        assert.same(obj.nonEnumerableMethod, nonEnumerableMethod);
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
});
