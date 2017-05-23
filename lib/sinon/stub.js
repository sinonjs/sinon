"use strict";

var behavior = require("./behavior");
var behaviors = require("./default-behaviors");
var spy = require("./spy");
var extend = require("./util/core/extend");
var functionToString = require("./util/core/function-to-string");
var getPropertyDescriptor = require("./util/core/get-property-descriptor");
var wrapMethod = require("./util/core/wrap-method");
var stubEntireObject = require("./stub-entire-object");
var stubDescriptor = require("./stub-descriptor");
var throwOnFalsyObject = require("./throw-on-falsy-object");

function stub(object, property, descriptor) {
    throwOnFalsyObject.apply(null, arguments);

    var actualDescriptor = getPropertyDescriptor(object, property);
    var isStubbingEntireObject = typeof property === "undefined" && typeof object === "object";
    var isCreatingNewStub = !object && typeof property === "undefined";
    var isStubbingDescriptor = object && property && Boolean(descriptor);
    var isStubbingNonFuncProperty = typeof object === "object"
                                    && typeof property !== "undefined"
                                    && (typeof actualDescriptor === "undefined"
                                    || typeof actualDescriptor.value !== "function")
                                    && typeof descriptor === "undefined";
    var isStubbingExistingMethod = !isStubbingDescriptor
                                    && typeof object === "object"
                                    && typeof actualDescriptor !== "undefined"
                                    && typeof actualDescriptor.value === "function";
    var arity = isStubbingExistingMethod ? object[property].length : 0;

    if (isStubbingEntireObject) {
        return stubEntireObject(stub, object);
    }

    if (isStubbingDescriptor) {
        return stubDescriptor.apply(null, arguments);
    }

    if (isCreatingNewStub) {
        return stub.create();
    }

    var s = stub.create(arity);
    s.rootObj = object;
    s.propName = property;
    s.restore = function restore() {
        if (actualDescriptor !== undefined) {
            Object.defineProperty(object, property, actualDescriptor);
            return;
        }

        delete object[property];
    };

    return isStubbingNonFuncProperty ? s : wrapMethod(object, property, s);
}

stub.createStubInstance = function (constructor) {
    if (typeof constructor !== "function") {
        throw new TypeError("The constructor should be a function.");
    }
    return stub(Object.create(constructor.prototype));
};

/*eslint-disable no-use-before-define*/
function getParentBehaviour(stubInstance) {
    return (stubInstance.parent && getCurrentBehavior(stubInstance.parent));
}

function getDefaultBehavior(stubInstance) {
    return stubInstance.defaultBehavior ||
            getParentBehaviour(stubInstance) ||
            behavior.create(stubInstance);
}

function getCurrentBehavior(stubInstance) {
    var currentBehavior = stubInstance.behaviors[stubInstance.callCount - 1];
    return currentBehavior && currentBehavior.isPresent() ? currentBehavior : getDefaultBehavior(stubInstance);
}
/*eslint-enable no-use-before-define*/

var uuid = 0;

var proto = {
    create: function create(stubLength) {
        var functionStub = function () {
            return getCurrentBehavior(functionStub).invoke(this, arguments);
        };

        functionStub.id = "stub#" + uuid++;
        var orig = functionStub;
        functionStub = spy.create(functionStub, stubLength);
        functionStub.func = orig;

        extend(functionStub, stub);
        functionStub.instantiateFake = stub.create;
        functionStub.displayName = "stub";
        functionStub.toString = functionToString;

        functionStub.defaultBehavior = null;
        functionStub.behaviors = [];

        return functionStub;
    },

    resetBehavior: function () {
        var fakes = this.fakes || [];

        this.defaultBehavior = null;
        this.behaviors = [];

        delete this.returnValue;
        delete this.returnArgAt;
        delete this.throwArgAt;
        delete this.fakeFn;
        this.returnThis = false;

        fakes.forEach(function (fake) {
            fake.resetBehavior();
        });
    },

    resetHistory: spy.reset,

    reset: function () {
        this.resetHistory();
        this.resetBehavior();
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

Object.keys(behavior).forEach(function (method) {
    if (behavior.hasOwnProperty(method) &&
        !proto.hasOwnProperty(method) &&
        method !== "create" &&
        method !== "withArgs" &&
        method !== "invoke") {
        proto[method] = behavior.createBehavior(method);
    }
});

Object.keys(behaviors).forEach(function (method) {
    if (behaviors.hasOwnProperty(method) && !proto.hasOwnProperty(method)) {
        behavior.addBehavior(stub, method, behaviors[method]);
    }
});

extend(stub, proto);
module.exports = stub;
