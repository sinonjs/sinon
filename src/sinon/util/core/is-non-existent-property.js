/**
 * @param {*} object
 * @param {string} property
 * @returns {boolean} whether a prop exists in the prototype chain
 */
export default function isNonExistentProperty(object, property) {
    return Boolean(
        object && typeof property !== "undefined" && !(property in object),
    );
}
