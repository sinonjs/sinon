import walk from "./util/core/walk.js";
import getPropertyDescriptor from "./util/core/get-property-descriptor.js";
import commons from "@sinonjs/commons";

const { prototypes } = commons;
const { hasOwnProperty } = prototypes.object;
const { push } = prototypes.array;

function collectMethod(methods, object, prop, propOwner) {
    const descriptor = getPropertyDescriptor(propOwner, prop);
    const value = descriptor.value;

    if (
        typeof value === "function" &&
        hasOwnProperty(object, prop) &&
        value &&
        value.restore &&
        value.restore.sinon
    ) {
        push(methods, value);
    }
}

/**
 * Returns an array of all the own methods on the passed object.
 *
 * @param {object} object The object to collect methods from
 * @returns {Array} Array of methods
 */
export default function collectOwnMethods(object) {
    const methods = [];

    walk(object, collectMethod.bind(null, methods, object));

    return methods;
}
