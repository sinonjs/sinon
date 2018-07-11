"use strict";

var call = Function.call;

module.exports = function copyPrototypeMethods(prototype) {
    return Object.getOwnPropertyNames(prototype)
        .reduce(
            function (result, name) {
                if (typeof prototype[name] === "function") {
                    result[name] = call.bind(prototype[name]);
                }

                return result;
            },
            Object.create(null)
        )
    ;
};
