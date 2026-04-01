import walk from "./util/core/walk.js";
import getPropertyDescriptor from "./util/core/get-property-descriptor.js";
import { prototypes } from "@sinonjs/commons";

const { hasOwnProperty } = prototypes.object;
const { push } = prototypes.array;

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
export default function collectOwnMethods(object) {
    const methods = [];

    walk(object, collectMethod.bind(null, methods, object));

    return methods;
}
