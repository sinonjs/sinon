'use strict';

var commons = require('@sinonjs/commons');
var behavior = require('./behavior.js');
var behaviors = require('./default-behaviors.js');
var createProxy = require('./proxy.js');
var isNonExistentProperty = require('./util/core/is-non-existent-property.js');
var spy = require('./spy.js');
var extend = require('./util/core/extend.js');
var getPropertyDescriptor = require('./util/core/get-property-descriptor.js');
var isEsModule = require('./util/core/is-es-module.js');
var sinonType = require('./util/core/sinon-type.js');
var wrapMethod = require('./util/core/wrap-method.js');
var throwOnFalsyObject = require('./throw-on-falsy-object.js');
var walkObject = require('./util/core/walk-object.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var commons__default = /*#__PURE__*/_interopDefault(commons);
var behaviors__default = /*#__PURE__*/_interopDefault(behaviors);
var createProxy__default = /*#__PURE__*/_interopDefault(createProxy);
var isNonExistentProperty__default = /*#__PURE__*/_interopDefault(isNonExistentProperty);
var spy__default = /*#__PURE__*/_interopDefault(spy);
var getPropertyDescriptor__default = /*#__PURE__*/_interopDefault(getPropertyDescriptor);
var isEsModule__default = /*#__PURE__*/_interopDefault(isEsModule);
var sinonType__default = /*#__PURE__*/_interopDefault(sinonType);
var wrapMethod__default = /*#__PURE__*/_interopDefault(wrapMethod);
var throwOnFalsyObject__default = /*#__PURE__*/_interopDefault(throwOnFalsyObject);
var walkObject__default = /*#__PURE__*/_interopDefault(walkObject);

const { prototypes: commonsPrototypes, functionName, valueToString } = commons__default.default;
const { array: arrayProto, object: objectProto } = commonsPrototypes;
const { hasOwnProperty } = objectProto;

const forEach = arrayProto.forEach;
const pop = arrayProto.pop;
const slice = arrayProto.slice;
const sort = arrayProto.sort;

let uuid = 0;

function createStub(originalFunc) {
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

    proxy = createProxy__default.default(functionStub, originalFunc || functionStub);
    // Inherit spy API:
    extend.nonEnum(proxy, spy__default.default);
    // Inherit stub API:
    extend.nonEnum(proxy, stub);

    const name = originalFunc ? functionName(originalFunc) : null;
    extend.nonEnum(proxy, {
        fakes: [],
        instantiateFake: createStub,
        displayName: name || "stub",
        defaultBehavior: null,
        behaviors: [],
        id: `stub#${uuid++}`,
    });

    sinonType__default.default.set(proxy, "stub");

    return proxy;
}

function stub(object, property) {
    if (arguments.length > 2) {
        throw new TypeError(
            "stub(obj, 'meth', fn) has been removed, see documentation",
        );
    }

    if (isEsModule__default.default(object)) {
        throw new TypeError("ES Modules cannot be stubbed");
    }

    throwOnFalsyObject__default.default.apply(null, arguments);

    if (isNonExistentProperty__default.default(object, property)) {
        throw new TypeError(
            `Cannot stub non-existent property ${valueToString(property)}`,
        );
    }

    const actualDescriptor = getPropertyDescriptor__default.default(object, property);

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
        return walkObject__default.default(stub, object);
    }

    if (isCreatingNewStub) {
        return createStub();
    }

    const func =
        typeof actualDescriptor.value === "function"
            ? actualDescriptor.value
            : null;
    const s = createStub(func);

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

    return isStubbingNonFuncProperty ? s : wrapMethod__default.default(object, property, s);
}

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

/*eslint-disable no-use-before-define*/
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
/*eslint-enable no-use-before-define*/

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
        const fake = spy__default.default.withArgs.apply(this, arguments);
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

forEach(Object.keys(behaviors__default.default), function (method) {
    if (hasOwnProperty(behaviors__default.default, method) && !hasOwnProperty(proto, method)) {
        behavior.addBehavior(stub, method, behaviors__default.default[method]);
    }
});

extend(stub, proto);

module.exports = stub;
