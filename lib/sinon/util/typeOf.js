function typeOf(value) {
    if (value === null) {
        return "null";
    } else if (value === undefined) {
        return "undefined";
    }
    var string = Object.prototype.toString.call(value);
    return string.substring(8, string.length - 1).toLowerCase();
}

module.exports = typeOf;
