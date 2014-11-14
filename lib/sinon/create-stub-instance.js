"use strict";
var fn = require("./functions");
var stub = require("./stub");

module.exports = function (constructor) {
    if (typeof constructor !== "function") {
        throw new TypeError("The constructor should be a function.");
    }
    return stub(fn.create(constructor.prototype));
};
