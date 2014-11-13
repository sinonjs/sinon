"use strict";
var typeOf = require("./typeOf");
var fn = require("./functions");

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
            if (match.isMatcher(exp)) {
                if (!exp.test(act)) {
                    return false;
                }
            } else if (typeOf(exp) === "object") {
                if (!matchObject(exp, act)) {
                    return false;
                }
            } else if (!match.equal(exp, act)) {
                return false;
            }
        }
    }
    return true;
}

matcher.or = function (m2) {
    if (!arguments.length) {
        throw new TypeError("Matcher expected");
    } else if (!isMatcher(m2)) {
        m2 = match(m2);
    }
    var m1 = this;
    var or = fn.create(matcher);
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
    var and = fn.create(matcher);
    and.test = function (actual) {
        return m1.test(actual) && m2.test(actual);
    };
    and.message = m1.message + ".and(" + m2.message + ")";
    return and;
};

var match = function (expectation, message) {
    var m = fn.create(matcher);
    var type = typeOf(expectation);
    switch (type) {
    case "object":
        if (typeof expectation.test === "function") {
            m.test = function (actual) {
                return expectation.test(actual) === true;
            };
            m.message = "match(" + fn.getName(expectation.test) + ")";
            return m;
        }
        var str = [];
        for (var key in expectation) {
            if (expectation.hasOwnProperty(key)) {
                str.push(key + ": " + expectation[key]);
            }
        }
        m.test = function (actual) {
            return matchObject(expectation, actual);
        };
        m.message = "match(" + str.join(", ") + ")";
        break;
    case "number":
        m.test = function (actual) {
            return expectation == actual;
        };
        break;
    case "string":
        m.test = function (actual) {
            if (typeof actual !== "string") {
                return false;
            }
            return actual.indexOf(expectation) !== -1;
        };
        m.message = "match(\"" + expectation + "\")";
        break;
    case "regexp":
        m.test = function (actual) {
            if (typeof actual !== "string") {
                return false;
            }
            return expectation.test(actual);
        };
        break;
    case "function":
        m.test = expectation;
        if (message) {
            m.message = message;
        } else {
            m.message = "match(" + fn.getName(expectation) + ")";
        }
        break;
    default:
        m.test = function (actual) {
            return match.equal(expectation, actual);
        };
    }
    if (!m.message) {
        m.message = "match(" + expectation + ")";
    }
    return m;
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
    }, "same(" + expectation + ")");
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
    }, "instanceOf(" + fn.getName(type) + ")");
};

function createPropertyMatcher(propertyTest, messagePrefix) {
    return function (property, value) {
        assertType(property, "string", "property");
        var onlyProperty = arguments.length === 1;
        var message = messagePrefix + "(\"" + property + "\"";
        if (!onlyProperty) {
            message += ", " + value;
        }
        message += ")";
        return match(function (actual) {
            if (actual === undefined || actual === null ||
                !propertyTest(actual, property)) {
                return false;
            }
            return onlyProperty || match.equal(value, actual[property]);
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

match.bool = match.typeOf("boolean");
match.number = match.typeOf("number");
match.string = match.typeOf("string");
match.object = match.typeOf("object");
match.func = match.typeOf("function");
match.array = match.typeOf("array");
match.regexp = match.typeOf("regexp");
match.date = match.typeOf("date");

match.equal = function (a, b) {
    return a == b;
};

module.exports = match;
