import walkObject from "./util/core/walk-object.js";

function filter(object, property) {
    return object[property].restore && object[property].restore.sinon;
}

function restore(object, property) {
    object[property].restore();
}

export default function restoreObject(object) {
    if (!object) {
        throw new Error(
            `Trying to restore object but received ${String(object)}`,
        );
    }

    return walkObject(restore, object, filter);
}
