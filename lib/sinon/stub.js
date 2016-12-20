/**
 * Stub functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var behavior = require("./behavior");
var spy = require("./spy");
var extend = require("./extend");
var walk = require("./util/core/walk");
var objectKeys = require("./util/core/object-keys");
var getPropertyDescriptor = require("./util/core/get-property-descriptor");
var createInstance = require("./util/core/create");
var deprecated = require("./util/core/deprecated");
var functionToString = require("./util/core/function-to-string");
var valueToString = require("./util/core/value-to-string");
var wrapMethod = require("./util/core/wrap-method");

function stub(object, property, descriptor) {
    if (!!descriptor && typeof descriptor === "function") {
        deprecated.printWarning(
          "sinon.stub(obj, 'meth', fn) is deprecated and will be removed from" +
          "the public API in a future version of sinon." +
          "\n Use stub(obj, 'meth').callsFake(fn)." +
          "\n Codemod available at https://github.com/hurrymaplelad/sinon-codemod"
        );
    }
    if (!!descriptor && typeof descriptor !== "function" && typeof descriptor !== "object") {
        throw new TypeError("Custom stub should be a property descriptor");
    }

    if (typeof descriptor === "object" && objectKeys(descriptor).length === 0) {
        throw new TypeError("Expected property descriptor to have at least one key");
    }

    if (property && !object) {
        var type = object === null ? "null" : "undefined";
        throw new Error("Trying to stub property '" + valueToString(property) + "' of " + type);
    }

    if (!object && typeof property === "undefined") {
        return stub.create();
    }

    var wrapper;
    if (descriptor) {
        if (typeof descriptor === "function") {
            wrapper = spy && spy.create ? spy.create(descriptor) : descriptor;
        } else {
            wrapper = descriptor;
            if (spy && spy.create) {
                var types = objectKeys(wrapper);
                for (var i = 0; i < types.length; i++) {
                    wrapper[types[i]] = spy.create(wrapper[types[i]]);
                }
            }
        }
    } else {
        var stubLength = 0;
        if (typeof object === "object" && typeof object[property] === "function") {
            stubLength = object[property].length;
        }
        wrapper = stub.create(stubLength);
    }

    if (typeof property === "undefined" && typeof object === "object") {
        walk(object || {}, function (prop, propOwner) {
            // we don't want to stub things like toString(), valueOf(), etc. so we only stub if the object
            // is not Object.prototype
            if (
                propOwner !== Object.prototype &&
                prop !== "constructor" &&
                typeof getPropertyDescriptor(propOwner, prop).value === "function"
            ) {
                stub(object, prop);
            }
        });

        return object;
    }

    return wrapMethod(object, property, wrapper);
}

stub.createStubInstance = function (constructor) {
    if (typeof constructor !== "function") {
        throw new TypeError("The constructor should be a function.");
    }
    return stub(createInstance(constructor.prototype));
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
        var i;

        this.defaultBehavior = null;
        this.behaviors = [];

        delete this.returnValue;
        delete this.returnArgAt;
        delete this.fakeFn;
        this.returnThis = false;

        if (this.fakes) {
            for (i = 0; i < this.fakes.length; i++) {
                this.fakes[i].resetBehavior();
            }
        }
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

function createBehavior(behaviorMethod) {
    return function () {
        this.defaultBehavior = this.defaultBehavior || behavior.create(this);
        this.defaultBehavior[behaviorMethod].apply(this.defaultBehavior, arguments);
        return this;
    };
}

for (var method in behavior) {
    if (behavior.hasOwnProperty(method) &&
        !proto.hasOwnProperty(method) &&
        method !== "create" &&
        method !== "withArgs" &&
        method !== "invoke") {
        proto[method] = createBehavior(method);
    }
}

extend(stub, proto);

module.exports = stub;
