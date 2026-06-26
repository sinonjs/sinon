import commons from "@sinonjs/commons";
import behavior from "./behavior.js";
import behaviors from "./default-behaviors.js";
import createProxy from "./proxy.js";
import isNonExistentProperty from "./util/core/is-non-existent-property.js";
import spy from "./spy.js";
import extend from "./util/core/extend.js";
import getPropertyDescriptor from "./util/core/get-property-descriptor.js";
import isEsModule from "./util/core/is-es-module.js";
import sinonType from "./util/core/sinon-type.js";
import wrapMethod from "./util/core/wrap-method.js";
import throwOnFalsyObject from "./throw-on-falsy-object.js";
import { walkObjectStrict } from "./util/core/walk-object.js";

const { prototypes: commonsPrototypes, functionName, valueToString } = commons;
const { array: arrayProto, object: objectProto } = commonsPrototypes;
const { hasOwnProperty } = objectProto;

const forEach = arrayProto.forEach;
const pop = arrayProto.pop;
const slice = arrayProto.slice;
const sort = arrayProto.sort;

/**
 * @callback SinonFunction
 * @param {...unknown} args
 * @returns {unknown}
 */

let uuid = 0;

/**
 * Creates a stub from a function.
 *
 * @param {SinonFunction} originalFunc The function to stub
 * @param {object} [context] The sinon context for callId tracking
 * @returns {SinonFunction} The stub
 */
function createStub(originalFunc, context) {
    // eslint-disable-next-line prefer-const
    let proxy;

    function functionStub() {
        const args = slice(arguments);
        const matchings = proxy.matchingFakes(args);

        const fnStub =
            pop(
                sort(matchings, function (a, b) {
                    return (
                        a.matchingArguments.length - b.matchingArguments.length
                    );
                }),
            ) || proxy;
        return getCurrentBehavior(fnStub).invoke(this, arguments);
    }

    proxy = createProxy(functionStub, originalFunc || functionStub, context);
    // Inherit spy API:
    extend.nonEnum(proxy, spy);
    // Inherit stub API:
    extend.nonEnum(proxy, stub);

    // Create a bound instantiateFake that preserves context
    const instantiateFake = function (f) {
        return createStub(f, context);
    };

    const name = originalFunc ? functionName(originalFunc) : null;
    extend.nonEnum(proxy, {
        fakes: [],
        instantiateFake: instantiateFake,
        displayName: name || "stub",
        defaultBehavior: null,
        behaviors: [],
        id: `stub#${uuid++}`,
    });

    sinonType.set(proxy, "stub");

    return proxy;
}

/**
 * Implementation of stub with optional context.
 *
 * @param {object|undefined} object The object to stub
 * @param {string|undefined} property The property name to stub
 * @param {object} [context] The sinon context for callId tracking
 * @returns {SinonFunction} The stub
 */
function stubImpl(object, property, context) {
    if (isEsModule(object)) {
        throw new TypeError("ES Modules cannot be stubbed");
    }

    throwOnFalsyObject(object, property);

    if (isNonExistentProperty(object, property)) {
        throw new TypeError(
            `Cannot stub non-existent property ${valueToString(property)}`,
        );
    }

    const actualDescriptor = getPropertyDescriptor(object, property);

    assertValidPropertyDescriptor(actualDescriptor, property);

    const isObjectOrFunction =
        typeof object === "object" || typeof object === "function";
    const isStubbingEntireObject =
        typeof property === "undefined" && isObjectOrFunction;
    const isCreatingNewStub = !object && typeof property === "undefined";
    const isStubbingNonFuncProperty =
        isObjectOrFunction &&
        typeof property !== "undefined" &&
        (typeof actualDescriptor === "undefined" ||
            typeof actualDescriptor.value !== "function");

    if (isStubbingEntireObject) {
        return walkObjectStrict(function (obj, prop) {
            return stubImpl(obj, prop, context);
        }, object);
    }

    if (isCreatingNewStub) {
        return createStub(undefined, context);
    }

    const func =
        typeof actualDescriptor.value === "function"
            ? actualDescriptor.value
            : null;
    const s = createStub(func, context);

    extend.nonEnum(s, {
        rootObj: object,
        propName: property,
        shadowsPropOnPrototype: !actualDescriptor.isOwn,
        restore: function restore() {
            if (actualDescriptor !== undefined && actualDescriptor.isOwn) {
                Object.defineProperty(object, property, actualDescriptor);
                return;
            }

            delete object[property];
        },
    });

    return isStubbingNonFuncProperty ? s : wrapMethod(object, property, s);
}

/**
 * Creates a stub (public API, backward compatible).
 *
 * @param {object} [object] The object to stub
 * @param {string} [property] The property name to stub
 * @returns {SinonFunction} The stub
 */
export default function stub(object, property) {
    if (arguments.length > 2) {
        throw new TypeError(
            "stub(obj, 'meth', fn) has been removed, see documentation",
        );
    }
    return stubImpl(object, property, undefined);
}

/**
 * Creates a stub with a specific context (for sandbox use).
 *
 * @param {object} context The sinon context for callId tracking
 * @param {object} [object] The object to stub
 * @param {string} [property] The property name to stub
 * @returns {SinonFunction} The stub
 */
stub.withContext = function (context, object, property) {
    return stubImpl(object, property, context);
};

function assertValidPropertyDescriptor(descriptor, property) {
    if (!descriptor || !property) {
        return;
    }
    if (descriptor.isOwn && !descriptor.configurable && !descriptor.writable) {
        throw new TypeError(
            `The descriptor for property \`${property}\` is non-configurable and non-writable. ` +
                `Sinon cannot stub properties that are immutable. ` +
                `See https://sinonjs.org/faq#property-descriptor-errors for help fixing this issue.`,
        );
    }
    if ((descriptor.get || descriptor.set) && !descriptor.configurable) {
        throw new TypeError(
            `Descriptor for accessor property ${property} is non-configurable`,
        );
    }
    if (isDataDescriptor(descriptor) && !descriptor.writable) {
        throw new TypeError(
            `Descriptor for data property ${property} is non-writable`,
        );
    }
}

function isDataDescriptor(descriptor) {
    return (
        !descriptor.value &&
        !descriptor.writable &&
        !descriptor.set &&
        !descriptor.get
    );
}

function getParentBehaviour(stubInstance) {
    return stubInstance.parent && getCurrentBehavior(stubInstance.parent);
}

function getDefaultBehavior(stubInstance) {
    return (
        stubInstance.defaultBehavior ||
        getParentBehaviour(stubInstance) ||
        behavior.create(stubInstance)
    );
}

function getCurrentBehavior(stubInstance) {
    const currentBehavior = stubInstance.behaviors[stubInstance.callCount - 1];
    return currentBehavior && currentBehavior.isPresent()
        ? currentBehavior
        : getDefaultBehavior(stubInstance);
}

const proto = {
    resetBehavior: function () {
        this.defaultBehavior = null;
        this.behaviors = [];

        delete this.returnValue;
        delete this.returnArgAt;
        delete this.throwArgAt;
        delete this.resolveArgAt;
        delete this.fakeFn;
        this.returnThis = false;
        this.resolveThis = false;

        forEach(this.fakes, function (fake) {
            fake.resetBehavior();
        });
    },

    reset: function () {
        this.resetHistory();
        this.resetBehavior();
    },

    onCall: function onCall(index) {
        if (!this.behaviors[index]) {
            this.behaviors[index] = behavior.create(this);
        }

        return this.behaviors[index];
    },

    onFirstCall: function onFirstCall() {
        return this.onCall(0);
    },

    onSecondCall: function onSecondCall() {
        return this.onCall(1);
    },

    onThirdCall: function onThirdCall() {
        return this.onCall(2);
    },

    withArgs: function withArgs() {
        const fake = spy.withArgs.apply(this, arguments);
        if (this.defaultBehavior && this.defaultBehavior.promiseLibrary) {
            fake.defaultBehavior =
                fake.defaultBehavior || behavior.create(fake);
            fake.defaultBehavior.promiseLibrary =
                this.defaultBehavior.promiseLibrary;
        }
        return fake;
    },
};

forEach(Object.keys(behavior), function (method) {
    if (
        hasOwnProperty(behavior, method) &&
        !hasOwnProperty(proto, method) &&
        method !== "create" &&
        method !== "invoke"
    ) {
        proto[method] = behavior.createBehavior(method);
    }
});

forEach(Object.keys(behaviors), function (method) {
    if (hasOwnProperty(behaviors, method) && !hasOwnProperty(proto, method)) {
        behavior.addBehavior(stub, method, behaviors[method]);
    }
});

extend(stub, proto);
