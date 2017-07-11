"use strict";

var collectOwnMethods = require("./collect-own-methods");
var getPropertyDescriptor = require("./util/core/get-property-descriptor");
var stubNonFunctionProperty = require("./stub-non-function-property");
var sinonStub = require("./stub");
var throwOnFalsyObject = require("./throw-on-falsy-object");

function sandboxStub(object, property) {
    if (arguments.length > 2) {
        throw new TypeError("stub(obj, 'meth', fn) has been removed, see documentation");
    }

    throwOnFalsyObject.apply(null, arguments);

    var actualDescriptor = getPropertyDescriptor(object, property);
    var isStubbingEntireObject = typeof property === "undefined" && typeof object === "object";
    var isStubbingNonFuncProperty = typeof object === "object"
                                    && typeof property !== "undefined"
                                    && (typeof actualDescriptor === "undefined"
                                    || typeof actualDescriptor.value !== "function");
    var stubbed = isStubbingNonFuncProperty ?
                    stubNonFunctionProperty.apply(null, arguments) :
                    sinonStub.apply(null, arguments);

    if (isStubbingEntireObject) {
        var ownMethods = collectOwnMethods(stubbed);
        ownMethods.forEach(this.add.bind(this));
        if (this.promiseLibrary) {
            ownMethods.forEach(this.addUsingPromise.bind(this));
        }
    } else {
        this.add(stubbed);
        if (this.promiseLibrary) {
            stubbed.usingPromise(this.promiseLibrary);
        }
    }

    return stubbed;
}

module.exports = sandboxStub;
