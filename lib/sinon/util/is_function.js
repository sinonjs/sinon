// Just a typeof check, but accepts oldIE native funcs (their typeof is "object")
module.exports = function isFunction(func) {
    if (typeof func == 'function') {
        return true;
    }
    if (typeof func == 'object' && func !== null) {
        return /^\s*function[^{]*{\s*\[native code\]\s*}\s*$/i.test(func.toString());
    }
    return false;
}


