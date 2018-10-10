"use strict";

var assert = require("@sinonjs/referee").assert;
var proxyquire = require("proxyquire");

function getColorMethods() {
    return [
        { name: "bold", code: 1 },
        { name: "cyan", code: 96 },
        { name: "green", code: 32 },
        { name: "red", code: 31 },
        { name: "white", code: 39 }
    ];
}

describe("color", function() {
    describe("when environment supports color", function() {
        var color;

        beforeEach(function() {
            color = proxyquire("../../../lib/sinon/color", {
                "supports-color": {
                    stdout: true
                }
            });
        });

        getColorMethods().forEach(function(method) {
            describe(method.name, function() {
                it("should return a colored string", function() {
                    var string = "lorem ipsum";
                    var actual = color[method.name](string);

                    assert.contains(actual, method.code + "m" + string);
                });
            });
        });
    });

    describe("when environment does not support color", function() {
        var color;

        beforeEach(function() {
            color = proxyquire("../../../lib/sinon/color", {
                "supports-color": {
                    stdout: false
                }
            });
        });

        getColorMethods().forEach(function(method) {
            describe(method.name, function() {
                it("should return a regular string", function() {
                    var string = "lorem ipsum";
                    var actual = color[method.name](string);

                    assert.equals(actual, string);
                });
            });
        });
    });
});
