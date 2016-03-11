"use strict";

var referee = require("referee");
var sinon = require("../lib/sinon");
var assert = referee.assert;

describe("sinon.typeOf", function () {
    it("returns boolean", function () {
        assert.equals(sinon.typeOf(false), "boolean");
    });

    it("returns string", function () {
        assert.equals(sinon.typeOf("Sinon.JS"), "string");
    });

    it("returns number", function () {
        assert.equals(sinon.typeOf(123), "number");
    });

    it("returns object", function () {
        assert.equals(sinon.typeOf({}), "object");
    });

    it("returns function", function () {
        assert.equals(sinon.typeOf(function () {}), "function");
    });

    it("returns undefined", function () {
        assert.equals(sinon.typeOf(undefined), "undefined");
    });

    it("returns null", function () {
        assert.equals(sinon.typeOf(null), "null");
    });

    it("returns array", function () {
        assert.equals(sinon.typeOf([]), "array");
    });

    it("returns regexp", function () {
        assert.equals(sinon.typeOf(/.*/), "regexp");
    });

    it("returns date", function () {
        assert.equals(sinon.typeOf(new Date()), "date");
    });
});
