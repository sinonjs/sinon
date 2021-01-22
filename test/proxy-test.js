"use strict";

var assert = require("@sinonjs/referee").assert;
var extend = require("../lib/sinon/util/core/extend");
var createProxy = require("../lib/sinon/proxy");

var color = require("../lib/sinon/color");
var sinonSpy = require("../lib/sinon/spy");
var sinonStub = require("../lib/sinon/stub");
var functionName = require("@sinonjs/commons").functionName;

var uuid = 0;
function createFaux(func) {
    var name;
    var funk = func;

    if (typeof funk !== "function") {
        funk = function () {
            return;
        };
    } else {
        name = functionName(funk);
    }

    var proxy = createProxy(funk, funk);

    extend.nonEnum(proxy, {
        displayName: name || "faux",
        fakes: [],
        instantiateFake: createFaux,
        id: "faux#" + uuid++,
    });
    return proxy;
}

describe("proxy", function () {
    describe(".printf", function () {
        describe("name", function () {
            it("named", function () {
                var named = createFaux(function cool() {
                    return;
                });
                assert.equals(named.printf("%n"), "cool");
            });
            it("anon", function () {
                var anon = sinonSpy(function () {
                    return;
                });
                assert.equals(anon.printf("%n"), "spy");

                var noFn = sinonSpy();
                assert.equals(noFn.printf("%n"), "spy");
            });
        });

        it("count", function () {
            // Throwing just to make sure it has no effect.
            var faux = createFaux(sinonStub().throws());
            function call() {
                assert.exception(function () {
                    faux();
                });
            }

            call();
            assert.equals(faux.printf("%c"), "once");
            call();
            assert.equals(faux.printf("%c"), "twice");
            call();
            assert.equals(faux.printf("%c"), "thrice");
            call();
            assert.equals(faux.printf("%c"), "4 times");
        });

        describe("calls", function () {
            it("oneLine", function () {
                function verify(arg, expected) {
                    var faux = createFaux();
                    faux(arg);
                    assert.equals(
                        faux.printf("%C").replace(/ at.*/g, ""),
                        "\n    " + expected
                    );
                }

                verify(true, "faux(true)");
                verify(false, "faux(false)");
                verify(undefined, "faux(undefined)");
                verify(1, "faux(1)");
                verify(0, "faux(0)");
                verify(-1, "faux(-1)");
                verify(-1.1, "faux(-1.1)");
                verify(Infinity, "faux(Infinity)");
                verify(["a"], "faux([ 'a' ])");
                verify({ a: "a" }, "faux({ a: 'a' })");
            });

            it("multiline", function () {
                var str = "faux\ntest";
                var faux = createFaux();

                faux(str);
                faux(str);
                faux(str);

                assert.equals(
                    faux.printf("%C").replace(/ at.*/g, ""),
                    "\n    faux('faux\\ntest')\n    faux('faux\\ntest')\n    faux('faux\\ntest')"
                );

                faux.resetHistory();

                faux("test");
                faux("faux\ntest");
                faux("faux\ntest");

                assert.equals(
                    faux.printf("%C").replace(/ at.*/g, ""),
                    "\n    faux('test')\n    faux('faux\\ntest')\n    faux('faux\\ntest')"
                );
            });
        });

        it("thisValues", function () {
            var faux = createFaux();
            faux();
            assert.equals(faux.printf("%t"), "undefined");

            faux.resetHistory();
            faux.call(true);
            assert.equals(faux.printf("%t"), "true");
        });

        it("unmatched", function () {
            var faux = createFaux();

            assert.equals(faux.printf("%λ"), "%λ");
        });

        it("*", function () {
            var faux = createFaux();

            assert.equals(
                faux.printf("%*", 1.4567, "a", true, {}, [], undefined, null),
                "1.4567, 'a', true, {}, [], undefined, null"
            );
            assert.equals(faux.printf("%*", "a", "b", "c"), "'a', 'b', 'c'");
        });

        describe("arguments", function () {
            it("no calls", function () {
                var faux = createFaux();

                assert.equals(faux.printf("%D"), "");
            });

            it("single call with arguments", function () {
                var faux = createFaux();

                faux(1, "a", true, false, [], {}, null, undefined);

                assert.equals(
                    faux.printf("%D"),
                    "\n" +
                        color.red("1") +
                        "\n" +
                        color.red("'\"a\"'") +
                        "\n" +
                        color.red("true") +
                        "\n" +
                        color.red("false") +
                        "\n" +
                        color.red("[]") +
                        "\n" +
                        color.red("{}") +
                        "\n" +
                        color.red("null") +
                        "\n" +
                        color.red("undefined")
                );
            });

            it("single call without arguments", function () {
                var faux = createFaux();

                faux();

                assert.equals(faux.printf("%D"), "");
            });

            it("multiple calls with arguments", function () {
                var faux = createFaux();

                faux(1, "a", true);
                faux(false, [], {});
                faux(null, undefined);

                assert.equals(
                    faux.printf("%D"),
                    "\nCall 1:" +
                        "\n" +
                        color.red("1") +
                        "\n" +
                        color.red("'\"a\"'") +
                        "\n" +
                        color.red("true") +
                        "\nCall 2:" +
                        "\n" +
                        color.red("false") +
                        "\n" +
                        color.red("[]") +
                        "\n" +
                        color.red("{}") +
                        "\nCall 3:" +
                        "\n" +
                        color.red("null") +
                        "\n" +
                        color.red("undefined")
                );
            });

            it("multiple calls without arguments", function () {
                var faux = createFaux();

                faux();
                faux();
                faux();

                assert.equals(faux.printf("%D"), "\nCall 1:\nCall 2:\nCall 3:");
            });
        });
    });
});
