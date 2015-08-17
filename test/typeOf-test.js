(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var sinon = root.sinon || require("../lib/sinon");
    var assert = buster.assert;

    buster.testCase("sinon.typeOf", {
        "returns boolean": function () {
            assert.equals(sinon.typeOf(false), "boolean");
        },

        "returns string": function () {
            assert.equals(sinon.typeOf("Sinon.JS"), "string");
        },

        "returns number": function () {
            assert.equals(sinon.typeOf(123), "number");
        },

        "returns object": function () {
            assert.equals(sinon.typeOf({}), "object");
        },

        "returns function": function () {
            assert.equals(sinon.typeOf(function () {}), "function");
        },

        "returns undefined": function () {
            assert.equals(sinon.typeOf(undefined), "undefined");
        },

        "returns null": function () {
            assert.equals(sinon.typeOf(null), "null");
        },

        "returns array": function () {
            assert.equals(sinon.typeOf([]), "array");
        },

        "returns regexp": function () {
            assert.equals(sinon.typeOf(/.*/), "regexp");
        },

        "returns date": function () {
            assert.equals(sinon.typeOf(new Date()), "date");
        }
    });
}(this));
