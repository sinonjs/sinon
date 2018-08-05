"use strict";

var defaultConfig = require("./default-config");
var hasOwnProperty = require("@sinonjs/commons").prototypes.object.hasOwnProperty;

module.exports = function getConfig(custom) {
    var config = {};
    var prop;

    custom = custom || {};

    for (prop in defaultConfig) {
        if (hasOwnProperty(defaultConfig, prop)) {
            config[prop] = hasOwnProperty(custom, prop) ? custom[prop] : defaultConfig[prop];
        }
    }

    return config;
};
