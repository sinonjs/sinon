import commons from "@sinonjs/commons";

const { valueToString } = commons;

/**
 * Throws an error if the object is null or undefined when trying to stub a property.
 *
 * @param {unknown} object The object to check
 * @param {string} property The property name
 */
export default function throwOnFalsyObject(object, property) {
    if (property && !object) {
        const type = object === null ? "null" : "undefined";
        throw new Error(
            `Trying to stub property '${valueToString(property)}' of ${type}`,
        );
    }
}
