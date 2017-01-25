"use strict";

var deprecated = require("./util/core/deprecated");
var objectKeys = require("./util/core/object-keys");
var spy = require("./spy");
var wrapMethod = require("./util/core/wrap-method");

// This is deprecated and will be removed in a future version of sinon.
// We will only consider pull requests that fix serious bugs in the implementation
function stubDescriptor(object, property, descriptor) {
    var wrapper;

    deprecated.printWarning(
      "sinon.stub(obj, 'meth', fn) is deprecated and will be removed from" +
      "the public API in a future version of sinon." +
      "\n Use stub(obj, 'meth').callsFake(fn)." +
      "\n Codemod available at https://github.com/hurrymaplelad/sinon-codemod"
    );

    if (!!descriptor && typeof descriptor !== "function" && typeof descriptor !== "object") {
        throw new TypeError("Custom stub should be a property descriptor");
    }

    if (typeof descriptor === "object" && objectKeys(descriptor).length === 0) {
        throw new TypeError("Expected property descriptor to have at least one key");
    }

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

    return wrapMethod(object, property, wrapper);
}

module.exports = stubDescriptor;
