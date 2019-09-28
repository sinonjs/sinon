"use strict";

var walkObject = require("./util/core/walk-object");

function restore(object, property) {
    if (object[property].restore && object[property].restore.sinon) {
        object[property].restore();
    }
}

function restoreObject(object) {
    return walkObject(restore, object);
}

module.exports = restoreObject;
