/**
 * Checks if an object is restorable (i.e. has a Sinon restore method).
 *
 * @param {object} obj The object to check
 * @returns {boolean} True if restorable
 */
export default function isRestorable(obj) {
    return (
        typeof obj === "function" &&
        typeof obj.restore === "function" &&
        obj.restore.sinon
    );
}
