/*jslint eqeqeq: false, onevar: false, forin: true*/
/*global module, require*/
/**
 * Collections of stubs, spies and mocks.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var sinon = require("./sinon");
var hasOwnProperty = Object.prototype.hasOwnProperty;

function each(fakes, method) {
    for (var i = 0, l = fakes.length; i < l; i += 1) {
        if (typeof fakes[i][method] == "function") {
            fakes[i][method]();
        }
    }
}

module.exports = function (globalSinon) {
    return {

        verify: function resolve() {
            if (this.fakes) {
                each(this.fakes, "verify");
            }
        },

        restore: function restore() {
            if (this.fakes) {
                each(this.fakes, "restore");
                this.fakes.length = 0;
            }
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
            if (!this.fakes) {
                this.fakes = [];
            }
            this.fakes.push(fake);
            return fake;
        },

        spy: function () {
            return this.add(globalSinon.spy.apply(null, arguments));
        },

        stub: function (object, property, value) {
            if (property) {
                var original = object[property];

                if (typeof original != "function") {
                    if (!hasOwnProperty.call(object, property)) {
                        throw new TypeError("Cannot stub non-existent own property " + property);
                    }

                    object[property] = value;

                    return this.add({
                        restore: function () {
                            object[property] = original;
                        }
                    });
                }
            }
            if (!property && !!object && typeof object == "object") {
                var stubbedObj = globalSinon.stub.apply(null, arguments);

                for (var prop in stubbedObj) {
                    if (typeof stubbedObj[prop] === "function") {
                        this.add(stubbedObj[prop]);
                    }
                }

                return stubbedObj;
            }

            return this.add(globalSinon.stub.apply(null, arguments));
        },

        mock: function () {
            return this.add(globalSinon.mock.apply(null, arguments));
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
};
