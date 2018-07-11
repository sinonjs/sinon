"use strict";

var objectProto = require("./var/object");
var walk = require("./util/core/walk");
var getPropertyDescriptor = require("./util/core/get-property-descriptor");

function collectMethod(methods, object, prop, propOwner) {
    if (
        typeof getPropertyDescriptor(propOwner, prop).value === "function" &&
        objectProto.hasOwnProperty(object, prop)
    ) {
        methods.push(object[prop]);
    }
}

// This function returns an array of all the own methods on the passed object
function collectOwnMethods(object) {
    var methods = [];

    walk(object, collectMethod.bind(null, methods, object));

    return methods;
}

module.exports = collectOwnMethods;
