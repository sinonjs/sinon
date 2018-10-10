"use strict";

var referee = require("@sinonjs/referee");
var restore = require("../../../lib/sinon/util/core/restore");
var createStub = require("../../../lib/sinon/stub");
var assert = referee.assert;

describe("util/core/restore", function() {
    it("restores all methods of supplied object", function() {
        var methodA = function() {
            return;
        };
        var methodB = function() {
            return;
        };
        var nonEnumerableMethod = function() {
            return;
        };
        var obj = { methodA: methodA, methodB: methodB, nonEnumerableMethod: nonEnumerableMethod };
        Object.defineProperty(obj, "nonEnumerableMethod", {
            enumerable: false
        });

        createStub(obj);
        restore(obj);

        assert.same(obj.methodA, methodA);
        assert.same(obj.methodB, methodB);
        assert.same(obj.nonEnumerableMethod, nonEnumerableMethod);
    });

    it("only restores restorable methods", function() {
        var stubbedMethod = function() {
            return;
        };
        var vanillaMethod = function() {
            return;
        };
        var obj = { stubbedMethod: stubbedMethod, vanillaMethod: vanillaMethod };

        createStub(obj, "stubbedMethod");
        restore(obj);

        assert.same(obj.stubbedMethod, stubbedMethod);
    });

    it("restores a single stubbed method", function() {
        var method = function() {
            return;
        };
        var obj = { method: method };

        createStub(obj);
        restore(obj.method);

        assert.same(obj.method, method);
    });
});
