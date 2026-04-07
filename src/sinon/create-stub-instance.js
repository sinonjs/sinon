import stub from "./stub.js";
import sinonType from "./util/core/sinon-type.js";
import commons from "@sinonjs/commons";

const { prototypes } = commons;
const { forEach } = prototypes.array;

function isStub(value) {
    return sinonType.get(value) === "stub";
}

/**
 * Creates a stub instance of a constructor.
 *
 * @param {Function} constructor The constructor function
 * @param {object} [overrides] Optional overrides for the stubbed methods
 * @returns {object} The stubbed instance
 */
export default function createStubInstance(constructor, overrides) {
    if (typeof constructor !== "function") {
        throw new TypeError("The constructor should be a function.");
    }

    const stubInstance = Object.create(constructor.prototype);
    sinonType.set(stubInstance, "stub-instance");

    const stubbedObject = stub(stubInstance);

    forEach(Object.keys(overrides || {}), function (propertyName) {
        if (propertyName in stubbedObject) {
            const value = overrides[propertyName];
            if (isStub(value)) {
                stubbedObject[propertyName] = value;
            } else {
                stubbedObject[propertyName].returns(value);
            }
        } else {
            throw new Error(
                `Cannot stub ${propertyName}. Property does not exist!`,
            );
        }
    });
    return stubbedObject;
}
