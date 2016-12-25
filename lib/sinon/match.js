/**
 * Match functions
 *
 * @author Maximilian Antoni (mail@maxantoni.de)
 * @license BSD
 *
 * Copyright (c) 2012 Maximilian Antoni
 */
"use strict";

var create = require("./util/core/create");
var deepEqual = require("./util/core/deep-equal").use(match); // eslint-disable-line no-use-before-define
var functionName = require("./util/core/function-name");
var typeOf = require("./typeOf");
var valueToString = require("./util/core/value-to-string");

var every = Array.prototype.every;
var indexOf = Array.prototype.indexOf;
var arrayToString = Array.prototype.toString;

function assertType(value, type, name) {
    var actual = typeOf(value);
    if (actual !== type) {
        throw new TypeError("Expected type of " + name + " to be " +
            type + ", but was " + actual);
    }
}

var matcher = {
    toString: function () {
        return this.message;
    }
};

function isMatcher(object) {
    return matcher.isPrototypeOf(object);
}

function matchObject(expectation, actual) {
    if (actual === null || actual === undefined) {
        return false;
    }
    for (var key in expectation) {
        if (expectation.hasOwnProperty(key)) {
            var exp = expectation[key];
            var act = actual[key];
            if (isMatcher(exp)) {
                if (!exp.test(act)) {
                    return false;
                }
            } else if (typeOf(exp) === "object") {
                if (!matchObject(exp, act)) {
                    return false;
                }
            } else if (!deepEqual(exp, act)) {
                return false;
            }
        }
    }
    return true;
}

var TYPE_MAP = {
    "function": function (m, expectation, message) {
        m.test = expectation;
        m.message = message || "match(" + functionName(expectation) + ")";
    },
    number: function (m, expectation) {
        m.test = function (actual) {
            // we need type coercion here
            return expectation == actual; // eslint-disable-line eqeqeq
        };
    },
    object: function (m, expectation) {
        var array = [];
        var key;

        if (typeof expectation.test === "function") {
            m.test = function (actual) {
                return expectation.test(actual) === true;
            };
            m.message = "match(" + functionName(expectation.test) + ")";
            return m;
        }

        for (key in expectation) {
            if (expectation.hasOwnProperty(key)) {
                array.push(key + ": " + valueToString(expectation[key]));
            }
        }
        m.test = function (actual) {
            return matchObject(expectation, actual);
        };
        m.message = "match(" + array.join(", ") + ")";

        return m;
    },
    regexp: function (m, expectation) {
        m.test = function (actual) {
            return typeof actual === "string" && expectation.test(actual);
        };
    },
    string: function (m, expectation) {
        m.test = function (actual) {
            return typeof actual === "string" && actual.indexOf(expectation) !== -1;
        };
        m.message = "match(\"" + expectation + "\")";
    }
};

function match(expectation, message) {
    var m = create(matcher);
    var type = typeOf(expectation);

    if (type in TYPE_MAP) {
        TYPE_MAP[type](m, expectation, message);
    } else {
        m.test = function (actual) {
            return deepEqual(expectation, actual);
        };
    }

    if (!m.message) {
        m.message = "match(" + valueToString(expectation) + ")";
    }

    return m;
}

matcher.or = function (m2) {
    if (!arguments.length) {
        throw new TypeError("Matcher expected");
    } else if (!isMatcher(m2)) {
        m2 = match(m2);
    }
    var m1 = this;
    var or = create(matcher);
    or.test = function (actual) {
        return m1.test(actual) || m2.test(actual);
    };
    or.message = m1.message + ".or(" + m2.message + ")";
    return or;
};

matcher.and = function (m2) {
    if (!arguments.length) {
        throw new TypeError("Matcher expected");
    } else if (!isMatcher(m2)) {
        m2 = match(m2);
    }
    var m1 = this;
    var and = create(matcher);
    and.test = function (actual) {
        return m1.test(actual) && m2.test(actual);
    };
    and.message = m1.message + ".and(" + m2.message + ")";
    return and;
};

match.isMatcher = isMatcher;

match.any = match(function () {
    return true;
}, "any");

match.defined = match(function (actual) {
    return actual !== null && actual !== undefined;
}, "defined");

match.truthy = match(function (actual) {
    return !!actual;
}, "truthy");

match.falsy = match(function (actual) {
    return !actual;
}, "falsy");

match.same = function (expectation) {
    return match(function (actual) {
        return expectation === actual;
    }, "same(" + valueToString(expectation) + ")");
};

match.typeOf = function (type) {
    assertType(type, "string", "type");
    return match(function (actual) {
        return typeOf(actual) === type;
    }, "typeOf(\"" + type + "\")");
};

match.instanceOf = function (type) {
    assertType(type, "function", "type");
    return match(function (actual) {
        return actual instanceof type;
    }, "instanceOf(" + functionName(type) + ")");
};

function createPropertyMatcher(propertyTest, messagePrefix) {
    return function (property, value) {
        assertType(property, "string", "property");
        var onlyProperty = arguments.length === 1;
        var message = messagePrefix + "(\"" + property + "\"";
        if (!onlyProperty) {
            message += ", " + valueToString(value);
        }
        message += ")";
        return match(function (actual) {
            if (actual === undefined || actual === null ||
                    !propertyTest(actual, property)) {
                return false;
            }
            return onlyProperty || deepEqual(value, actual[property]);
        }, message);
    };
}

match.has = createPropertyMatcher(function (actual, property) {
    if (typeof actual === "object") {
        return property in actual;
    }
    return actual[property] !== undefined;
}, "has");

match.hasOwn = createPropertyMatcher(function (actual, property) {
    return actual.hasOwnProperty(property);
}, "hasOwn");

match.array = match.typeOf("array");

match.array.deepEquals = function (expectation) {
    return match(function (actual) {
        // Comparing lengths is the fastest way to spot a difference before iterating through every item
        var sameLength = actual.length === expectation.length;
        return typeOf(actual) === "array" && sameLength && every.call(actual, function (element, index) {
            return expectation[index] === element;
        });
    }, "deepEquals([" + arrayToString.call(expectation) + "])");
};

match.array.startsWith = function (expectation) {
    return match(function (actual) {
        return typeOf(actual) === "array" && every.call(expectation, function (expectedElement, index) {
            return actual[index] === expectedElement;
        });
    }, "startsWith([" + arrayToString.call(expectation) + "])");
};

match.array.endsWith = function (expectation) {
    return match(function (actual) {
        // This indicates the index in which we should start matching
        var offset = actual.length - expectation.length;

        return typeOf(actual) === "array" && every.call(expectation, function (expectedElement, index) {
            return actual[offset + index] === expectedElement;
        });
    }, "endsWith([" + arrayToString.call(expectation) + "])");
};

match.array.contains = function (expectation) {
    return match(function (actual) {
        return every.call(expectation, function (expectedElement) {
            return indexOf.call(actual, expectedElement) !== -1;
        });
    }, "contains([" + arrayToString.call(expectation) + "])");
};

match.bool = match.typeOf("boolean");
match.number = match.typeOf("number");
match.string = match.typeOf("string");
match.object = match.typeOf("object");
match.func = match.typeOf("function");
match.regexp = match.typeOf("regexp");
match.date = match.typeOf("date");
match.symbol = match.typeOf("symbol");

module.exports = match;
