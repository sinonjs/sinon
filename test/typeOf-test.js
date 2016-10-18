"use strict";

var referee = require("referee");
var sinonTypeOf = require("../lib/sinon/typeOf");
var assert = referee.assert;

describe("typeOf", function () {
    it("returns boolean", function () {
        assert.equals(sinonTypeOf(false), "boolean");
    });

    it("returns string", function () {
        assert.equals(sinonTypeOf("Sinon.JS"), "string");
    });

    it("returns number", function () {
        assert.equals(sinonTypeOf(123), "number");
    });

    it("returns object", function () {
        assert.equals(sinonTypeOf({}), "object");
    });

    it("returns function", function () {
        assert.equals(sinonTypeOf(function () {}), "function");
    });

    it("returns undefined", function () {
        assert.equals(sinonTypeOf(undefined), "undefined");
    });

    it("returns null", function () {
        assert.equals(sinonTypeOf(null), "null");
    });

    it("returns array", function () {
        assert.equals(sinonTypeOf([]), "array");
    });

    it("returns regexp", function () {
        assert.equals(sinonTypeOf(/.*/), "regexp");
    });

    it("returns date", function () {
        assert.equals(sinonTypeOf(new Date()), "date");
    });
});
