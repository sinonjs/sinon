'use strict';

var commons = require('@sinonjs/commons');

/**
 * Throws an error if the object is null or undefined when trying to stub a property.
 *
 * @param {*} object The object to check
 * @param {string} property The property name
 */
function throwOnFalsyObject(object, property) {
    if (property && !object) {
        const type = object === null ? "null" : "undefined";
        throw new Error(
            `Trying to stub property '${commons.valueToString(property)}' of ${type}`,
        );
    }
}

module.exports = throwOnFalsyObject;
