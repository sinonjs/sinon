"use strict";

var assert = require("@sinonjs/referee").assert;

var color = require("../lib/sinon/color");
var sinonSpy = require("../lib/sinon/spy");
var sinonStub = require("../lib/sinon/stub");

describe("proxy", function() {
    describe(".printf", function() {
        describe("name", function() {
            it("named", function() {
                var named = sinonSpy(function cool() {
                    return;
                });
                assert.equals(named.printf("%n"), "cool");
            });
            it("anon", function() {
                var anon = sinonSpy(function() {
                    return;
                });
                assert.equals(anon.printf("%n"), "spy");

                var noFn = sinonSpy();
                assert.equals(noFn.printf("%n"), "spy");
            });
        });

        it("count", function() {
            // Throwing just to make sure it has no effect.
            var spy = sinonSpy(sinonStub().throws());
            function call() {
                assert.exception(function() {
                    spy();
                });
            }

            call();
            assert.equals(spy.printf("%c"), "once");
            call();
            assert.equals(spy.printf("%c"), "twice");
            call();
            assert.equals(spy.printf("%c"), "thrice");
            call();
            assert.equals(spy.printf("%c"), "4 times");
        });

        describe("calls", function() {
            it("oneLine", function() {
                function verify(arg, expected) {
                    var spy = sinonSpy();
                    spy(arg);
                    assert.equals(spy.printf("%C").replace(/ at.*/g, ""), "\n    " + expected);
                }

                verify(true, "spy(true)");
                verify(false, "spy(false)");
                verify(undefined, "spy(undefined)");
                verify(1, "spy(1)");
                verify(0, "spy(0)");
                verify(-1, "spy(-1)");
                verify(-1.1, "spy(-1.1)");
                verify(Infinity, "spy(Infinity)");
                verify(["a"], 'spy(["a"])');
                verify({ a: "a" }, 'spy({ a: "a" })');
            });

            it("multiline", function() {
                var str = "spy\ntest";
                var spy = sinonSpy();

                spy(str);
                spy(str);
                spy(str);

                assert.equals(
                    spy.printf("%C").replace(/ at.*/g, ""),
                    "\n    spy(" + str + ")\n\n    spy(" + str + ")\n\n    spy(" + str + ")"
                );

                spy.resetHistory();

                spy("test");
                spy("spy\ntest");
                spy("spy\ntest");

                assert.equals(
                    spy.printf("%C").replace(/ at.*/g, ""),
                    "\n    spy(test)\n    spy(" + str + ")\n\n    spy(" + str + ")"
                );
            });
        });

        it("thisValues", function() {
            var spy = sinonSpy();
            spy();
            assert.equals(spy.printf("%t"), "undefined");

            spy.resetHistory();
            spy.call(true);
            assert.equals(spy.printf("%t"), "true");
        });

        it("unmatched", function() {
            var spy = sinonSpy();

            assert.equals(spy.printf("%λ"), "%λ");
        });

        it("*", function() {
            var spy = sinonSpy();

            assert.equals(
                spy.printf("%*", 1.4567, "a", true, {}, [], undefined, null),
                "1.4567, a, true, {  }, [], undefined, null"
            );
            assert.equals(spy.printf("%*", "a", "b", "c"), "a, b, c");
        });

        describe("arguments", function() {
            it("no calls", function() {
                var spy = sinonSpy();

                assert.equals(spy.printf("%D"), "");
            });

            it("single call with arguments", function() {
                var spy = sinonSpy();

                spy(1, "a", true, false, [], {}, null, undefined);

                assert.equals(
                    spy.printf("%D"),
                    "\n" +
                        color.red("1") +
                        "\n" +
                        color.red("a") +
                        "\n" +
                        color.red("true") +
                        "\n" +
                        color.red("false") +
                        "\n" +
                        color.red("[]") +
                        "\n" +
                        color.red("{  }") +
                        "\n" +
                        color.red("null") +
                        "\n" +
                        color.red("undefined")
                );
            });

            it("single call without arguments", function() {
                var spy = sinonSpy();

                spy();

                assert.equals(spy.printf("%D"), "");
            });

            it("multiple calls with arguments", function() {
                var spy = sinonSpy();

                spy(1, "a", true);
                spy(false, [], {});
                spy(null, undefined);

                assert.equals(
                    spy.printf("%D"),
                    "\nCall 1:" +
                        "\n" +
                        color.red("1") +
                        "\n" +
                        color.red("a") +
                        "\n" +
                        color.red("true") +
                        "\nCall 2:" +
                        "\n" +
                        color.red("false") +
                        "\n" +
                        color.red("[]") +
                        "\n" +
                        color.red("{  }") +
                        "\nCall 3:" +
                        "\n" +
                        color.red("null") +
                        "\n" +
                        color.red("undefined")
                );
            });

            it("multiple calls without arguments", function() {
                var spy = sinonSpy();

                spy();
                spy();
                spy();

                assert.equals(spy.printf("%D"), "\nCall 1:\nCall 2:\nCall 3:");
            });
        });
    });
});
