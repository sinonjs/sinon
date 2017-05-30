"use strict";

var collectOwnMethods = require("./collect-own-methods");
var deprecated = require("./util/core/deprecated");
var getPropertyDescriptor = require("./util/core/get-property-descriptor");
var stubNonFunctionProperty = require("./stub-non-function-property");
var sinonStub = require("./stub");
var throwOnFalsyObject = require("./throw-on-falsy-object");

// This is deprecated and will be removed in a future version of sinon.
// We will only consider pull requests that fix serious bugs in the implementation
function sandboxStub(object, property/*, value*/) {
    deprecated.printWarning(
      "sandbox.stub(obj, 'meth', val) is deprecated and will be removed from " +
      "the public API in a future version of sinon." +
      "\n Use sandbox.stub(obj, 'meth').callsFake(fn) instead in order to stub a function." +
      "\n Use sandbox.stub(obj, 'meth').value(fn) instead in order to stub a non-function value."
    );

    throwOnFalsyObject.apply(null, arguments);

    var actualDescriptor = getPropertyDescriptor(object, property);
    var isStubbingEntireObject = typeof property === "undefined" && typeof object === "object";
    var isStubbingNonFuncProperty = typeof object === "object"
                                    && typeof property !== "undefined"
                                    && (typeof actualDescriptor === "undefined"
                                    || typeof actualDescriptor.value !== "function");


    // When passing a value as third argument it will be applied to stubNonFunctionProperty
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
