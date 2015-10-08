"use strict";

var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function objectKeys(obj) {
    if (obj !== Object(obj)) {
        throw new TypeError("sinon.objectKeys called on a non-object");
    }

    var keys = [];
    var key;
    for (key in obj) {
        if (hasOwn.call(obj, key)) {
            keys.push(key);
        }
    }

    return keys;
};
