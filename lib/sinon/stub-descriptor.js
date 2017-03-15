"use strict";

var deprecated = require("./util/core/deprecated");
var spy = require("./spy");
var wrapMethod = require("./util/core/wrap-method");

// This is deprecated and will be removed in a future version of sinon.
// We will only consider pull requests that fix serious bugs in the implementation
function stubDescriptor(object, property, descriptor) {
    var wrapper;

    deprecated.printWarning(
      "sinon.stub(obj, 'meth', fn) is deprecated and will be removed from " +
      "the public API in a future version of sinon." +
      "\n Use stub(obj, 'meth').callsFake(fn)." +
      "\n Codemod available at https://github.com/hurrymaplelad/sinon-codemod"
    );

    if (!!descriptor && typeof descriptor !== "function" && typeof descriptor !== "object") {
        throw new TypeError("Custom stub should be a property descriptor");
    }

    if (typeof descriptor === "object" && Object.keys(descriptor).length === 0) {
        throw new TypeError("Expected property descriptor to have at least one key");
    }

    if (typeof descriptor === "function") {
        wrapper = spy && spy.create ? spy.create(descriptor) : descriptor;
    } else {
        wrapper = descriptor;
        if (spy && spy.create) {
            Object.keys(wrapper).forEach(function (type) {
                wrapper[type] = spy.create(wrapper[type]);
            });
        }
    }

    return wrapMethod(object, property, wrapper);
}

module.exports = stubDescriptor;
