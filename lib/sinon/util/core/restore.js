"use strict";

function isRestorable(obj) {
    return typeof obj === "function" && typeof obj.restore === "function" && obj.restore.sinon;
}

module.exports = function restore(object) {
    if (object !== null && typeof object === "object") {
        for (var prop in object) {
            if (isRestorable(object[prop])) {
                object[prop].restore();
            }
        }
    } else if (isRestorable(object)) {
        object.restore();
    }
};
