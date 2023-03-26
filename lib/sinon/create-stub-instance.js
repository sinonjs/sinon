"use strict";

const stub = require("./stub");
const forEach = require("@sinonjs/commons").prototypes.array.forEach;

function isStub(value) {
    return value && value.throws && value.returns;
}

module.exports = function createStubInstance(constructor, overrides) {
    if (typeof constructor !== "function") {
        throw new TypeError("The constructor should be a function.");
    }

    const stubInstance = Object.create(constructor.prototype);
    stubInstance[Symbol.for("SinonType")] = "StubInstance";

    const stubbedObject = stub(stubInstance);

    forEach(Object.keys(overrides || {}), function (propertyName) {
        if (propertyName in stubbedObject) {
            var value = overrides[propertyName];
            if (isStub(value)) {
                stubbedObject[propertyName] = value;
            } else {
                stubbedObject[propertyName].returns(value);
            }
        } else {
            throw new Error(
                `Cannot stub ${propertyName}. Property does not exist!`
            );
        }
    });
    return stubbedObject;
};
