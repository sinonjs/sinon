"use strict";

module.exports = function getPropertyDescriptor(object, property) {
    let proto = object;
    let descriptor;
    const isOwn = Boolean(
        object && Object.getOwnPropertyDescriptor(object, property)
    );

    while (
        proto &&
        !(descriptor = Object.getOwnPropertyDescriptor(proto, property))
    ) {
        proto = Object.getPrototypeOf(proto);
    }

    if (descriptor) {
        descriptor.isOwn = isOwn;
    }

    return descriptor;
};
