"use strict";

module.exports = function (value) {
    if (value && value.toString) {
        /* eslint-disable-next-line local-rules/no-prototype-methods */
        return value.toString();
    }
    return String(value);
};
