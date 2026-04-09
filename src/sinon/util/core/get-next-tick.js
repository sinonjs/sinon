/* istanbul ignore next : not testing that setTimeout works */
function nextTick(callback) {
    setTimeout(callback, 0);
}

/**
 * Returns a next-tick function.
 *
 * @param {object} [process] The process object
 * @param {Function} [setImmediate] The setImmediate function
 * @returns {Function} The next-tick function
 */
export default function getNextTick(process, setImmediate) {
    if (typeof process === "object" && typeof process.nextTick === "function") {
        return process.nextTick;
    }

    if (typeof setImmediate === "function") {
        return setImmediate;
    }

    return nextTick;
}
