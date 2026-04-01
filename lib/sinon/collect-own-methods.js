'use strict';

var walk = require('./util/core/walk.js');
var getPropertyDescriptor = require('./util/core/get-property-descriptor.js');
var commons = require('@sinonjs/commons');

const { hasOwnProperty } = commons.prototypes.object;
const { push } = commons.prototypes.array;

function collectMethod(methods, object, prop, propOwner) {
    if (
        typeof getPropertyDescriptor(propOwner, prop).value === "function" &&
        hasOwnProperty(object, prop)
    ) {
        push(methods, object[prop]);
    }
}

/**
 * Returns an array of all the own methods on the passed object.
 *
 * @param {object} object The object to collect methods from
 * @returns {Array} Array of methods
 */
function collectOwnMethods(object) {
    const methods = [];

    walk(object, collectMethod.bind(null, methods, object));

    return methods;
}

module.exports = collectOwnMethods;
