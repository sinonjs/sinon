"use strict";

const defaultConfig = require("../lib/sinon/util/core/default-config");
const hasOwnProperty =
    require("@sinonjs/commons").prototypes.object.hasOwnProperty;

module.exports = function getConfig(custom) {
    const config = {};
    let prop;
    const kustom = custom || {};

    for (prop in defaultConfig) {
        if (hasOwnProperty(defaultConfig, prop)) {
            config[prop] = hasOwnProperty(kustom, prop)
                ? kustom[prop]
                : defaultConfig[prop];
        }
    }

    return config;
};
