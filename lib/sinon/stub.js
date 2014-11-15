"use strict";
var spy = require("./spy");
var wrapMethod = require("./wrap-method");
var behavior = require("./behavior");
var extend = require("./extend");
var fn = require("./functions");

function stub(object, property, func) {
    if (!!func && typeof func !== "function") {
        throw new TypeError("Custom stub should be function");
    }

    var wrapper;

    if (func) {
        wrapper = spy(func);
    } else {
        wrapper = stub.create();
    }

    if (!object && property === undefined) {
        return stub.create();
    }

    if (property === undefined && typeof object === "object") {
        for (var prop in object) {
            if (typeof object[prop] === "function") {
                stub(object, prop);
            }
        }

        return object;
    }

    return wrapMethod(object, property, wrapper);
}

function getDefaultBehavior(stub) {
    return stub.defaultBehavior || getParentBehaviour(stub) || behavior.create(stub);
}

function getParentBehaviour(stub) {
    return (stub.parent && getCurrentBehavior(stub.parent));
}

function getCurrentBehavior(stub) {
    var behavior = stub.behaviors[stub.callCount - 1];
    return behavior && behavior.isPresent() ? behavior : getDefaultBehavior(stub);
}

var uuid = 0;

var proto = {
    create: function create() {
        var functionStub = function () {
            return getCurrentBehavior(functionStub).invoke(this, arguments);
        };

        functionStub.id = "stub#" + uuid++;
        var orig = functionStub;
        functionStub = spy(functionStub);
        functionStub.func = orig;

        extend(functionStub, stub);
        functionStub.instantiateFake = stub.create;
        functionStub.displayName = "stub";
        functionStub.toString = fn.toString;

        functionStub.defaultBehavior = null;
        functionStub.behaviors = [];

        return functionStub;
    },

    resetBehavior: function () {
        var i;

        this.defaultBehavior = null;
        this.behaviors = [];

        delete this.returnValue;
        delete this.returnArgAt;
        this.returnThis = false;

        if (this.fakes) {
            for (i = 0; i < this.fakes.length; i++) {
                this.fakes[i].resetBehavior();
            }
        }
    },

    onCall: function onCall(index) {
        if (!this.behaviors[index]) {
            this.behaviors[index] = behavior.create(this);
        }

        return this.behaviors[index];
    },

    onFirstCall: function onFirstCall() {
        return this.onCall(0);
    },

    onSecondCall: function onSecondCall() {
        return this.onCall(1);
    },

    onThirdCall: function onThirdCall() {
        return this.onCall(2);
    }
};

for (var method in behavior) {
    if (behavior.hasOwnProperty(method) &&
        !proto.hasOwnProperty(method) &&
        method != "create" &&
        method != "withArgs" &&
        method != "invoke") {
        proto[method] = (function (behaviorMethod) {
            return function () {
                this.defaultBehavior = this.defaultBehavior || behavior.create(this);
                this.defaultBehavior[behaviorMethod].apply(this.defaultBehavior, arguments);
                return this;
            };
        }(method));
    }
}

extend(stub, proto);
module.exports = stub;
