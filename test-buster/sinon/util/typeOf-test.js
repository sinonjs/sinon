var buster = require("buster");
var assert = buster.assert;

var typeOf = require("../../../lib/sinon/util/typeOf");

buster.testCase("typeOf", {
    "returns boolean": function () {
        assert.equals(typeOf(false), "boolean");
    },

    "returns string": function () {
        assert.equals(typeOf("Sinon.JS"), "string");
    },

    "returns number": function () {
        assert.equals(typeOf(123), "number");
    },

    "returns object": function () {
        assert.equals(typeOf({}), "object");
    },

    "returns function": function () {
        assert.equals(typeOf(function () {}), "function");
    },

    "returns undefined": function () {
        assert.equals(typeOf(undefined), "undefined");
    },

    "returns null": function () {
        assert.equals(typeOf(null), "null");
    },

    "returns array": function () {
        assert.equals(typeOf([]), "array");
    },

    "returns regexp": function () {
        assert.equals(typeOf(/.*/), "regexp");
    },

    "returns date": function () {
        assert.equals(typeOf(new Date()), "date");
    }
});
