/**
 * Collections of stubs, spies and mocks.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var sinonSpy = require("./spy");
var sinonStub = require("./stub");
var sinonMock = require("./mock");
var throwOnFalsyObject = require("./throw-on-falsy-object");
var collectOwnMethods = require("./collect-own-methods");
var stubNonFunctionProperty = require("./stub-non-function-property");

var push = [].push;

function getFakes(fakeCollection) {
    if (!fakeCollection.fakes) {
        fakeCollection.fakes = [];
    }

    return fakeCollection.fakes;
}

function each(fakeCollection, method) {
    var fakes = getFakes(fakeCollection);

    for (var i = 0, l = fakes.length; i < l; i += 1) {
        if (typeof fakes[i][method] === "function") {
            fakes[i][method]();
        }
    }
}

function compact(fakeCollection) {
    var fakes = getFakes(fakeCollection);
    var i = 0;
    while (i < fakes.length) {
        fakes.splice(i, 1);
    }
}

var collection = {
    verify: function verify() {
        each(this, "verify");
    },

    restore: function restore() {
        each(this, "restore");
        compact(this);
    },

    reset: function reset() {
        each(this, "reset");
    },

    resetBehavior: function resetBehavior() {
        each(this, "resetBehavior");
    },

    resetHistory: function resetHistory() {
        each(this, "resetHistory");
    },

    verifyAndRestore: function verifyAndRestore() {
        var exception;

        try {
            this.verify();
        } catch (e) {
            exception = e;
        }

        this.restore();

        if (exception) {
            throw exception;
        }
    },

    add: function add(fake) {
        push.call(getFakes(this), fake);
        return fake;
    },

    spy: function spy() {
        return this.add(sinonSpy.apply(sinonSpy, arguments));
    },

    stub: function stub(object, property/*, value*/) {
        throwOnFalsyObject.apply(null, arguments);

        var isStubbingEntireObject = typeof property === "undefined" && typeof object === "object";
        var isStubbingNonFunctionProperty = property && typeof object[property] !== "function";
        var stubbed = isStubbingNonFunctionProperty ?
                        stubNonFunctionProperty.apply(null, arguments) :
                        sinonStub.apply(null, arguments);

        if (isStubbingEntireObject) {
            collectOwnMethods(stubbed).forEach(this.add.bind(this));
        } else {
            this.add(stubbed);
        }

        return stubbed;
    },

    mock: function mock() {
        return this.add(sinonMock.apply(null, arguments));
    },

    inject: function inject(obj) {
        var col = this;

        obj.spy = function () {
            return col.spy.apply(col, arguments);
        };

        obj.stub = function () {
            return col.stub.apply(col, arguments);
        };

        obj.mock = function () {
            return col.mock.apply(col, arguments);
        };

        return obj;
    }
};

module.exports = collection;
