"use strict";

var getPropertyDescriptor = require("./util/core/get-property-descriptor");
var walk = require("./util/core/walk");

function restoreObject(object) {
    walk(object || {}, function(prop, propOwner) {
        if (
            propOwner !== Object.prototype &&
            prop !== "constructor" &&
            typeof getPropertyDescriptor(propOwner, prop).value === "function"
        ) {
            if (object[prop].restore && object[prop].restore.sinon) {
                object[prop].restore();
            }
        }
    });

    return object;
}

module.exports = restoreObject;
