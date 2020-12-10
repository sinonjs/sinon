"use strict";

var deprecated = require("@sinonjs/commons").deprecated;

/**
 * Verify an object's property is not an ECMAScript Module property
 *
 * As the exports from a module is immutable we cannot alter the exports
 * using spies or stubs. Let the consumer know this to avoid bug reports
 * on weird error messages.
 *
 * @param {Object} object The object to examine
 * @param {string} property The property to examine
 */
module.exports = function(object, property) {
    // eslint-disable-next-line no-underscore-dangle
    if (!object || !object.__esModule) {
        return;
    }

    var own = Object.getOwnPropertyDescriptor(object, property);
    if (!own.get || own.set) {
        return;
    }

    var msg =
        'Property "' +
        property +
        '" cannot be overriden, it appears to be a ES Module read-only property. ' +
        "These can be generated with re-exports in Typescript.";

    switch (process.env.SINON_ES_MODULE_DETECTION) {
        case "error":
            throw new TypeError(msg);
        case "ignore":
            break;
        case "warn":
        default:
            deprecated.printWarning(msg);
    }
};
