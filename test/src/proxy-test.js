import commons from "@sinonjs/commons";
import referee from "@sinonjs/referee";
import extend from "../../src/sinon/util/core/extend.js";
import createProxy from "../../src/sinon/proxy.js";
import Colorizer from "../../src/sinon/colorizer.js";
import sinonSpy from "../../src/sinon/spy.js";
import sinonStub from "../../src/sinon/stub.js";

const color = new Colorizer();
const assert = referee.assert;
const functionName = commons.functionName;

let uuid = 0;
function createFaux(func) {
    let name;
    let funk = func;

    if (typeof funk !== "function") {
        funk = function () {
            return;
        };
    } else {
        name = functionName(funk);
    }

    const proxy = createProxy(funk, funk);

    extend.nonEnum(proxy, {
        displayName: name || "faux",
        fakes: [],
        instantiateFake: createFaux,
        id: `faux#${uuid++}`,
    });
    return proxy;
}

function createArityFunction(length) {
    const args = [];
    for (let i = 0; i < length; i++) {
        args.push(`a${i}`);
    }

    // Use the Function constructor to produce a stable declared arity without
    // relying on eval in the test body.
    // eslint-disable-next-line no-new-func
    return new Function(
        `return function (${args.join(", ")}) { return this.marker; };`,
    )();
}

describe("proxy", function () {
    describe(".printf", function () {
        describe("name", function () {
            it("named", function () {
                const named = createFaux(function cool() {
                    return;
                });
                assert.equals(named.printf("%n"), "cool");
            });

            it("does not rename non-configurable names", function () {
                const named = createFaux(function cool() {
                    return;
                });

                Object.defineProperty(named, "name", {
                    value: "locked",
                    configurable: false,
                });

                named.named("updated");

                assert.equals(named.name, "locked");
            });

            it("anon", function () {
                const anon = sinonSpy(function () {
                    return;
                });
                assert.equals(anon.printf("%n"), "spy");

                const noFn = sinonSpy();
                assert.equals(noFn.printf("%n"), "spy");
            });
        });

        it("count", function () {
            // Throwing just to make sure it has no effect.
            const faux = createFaux(sinonStub().throws());
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
                    const faux = createFaux();
                    faux(arg);
                    assert.equals(
                        faux.printf("%C").replace(/ at.*/g, ""),
                        `\n    ${expected}`,
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
                const str = "faux\ntest";
                const faux = createFaux();

                faux(str);
                faux(str);
                faux(str);

                assert.equals(
                    faux.printf("%C").replace(/ at.*/g, ""),
                    "\n    faux('faux\\ntest')\n    faux('faux\\ntest')\n    faux('faux\\ntest')",
                );

                faux.resetHistory();

                faux("test");
                faux("faux\ntest");
                faux("faux\ntest");

                assert.equals(
                    faux.printf("%C").replace(/ at.*/g, ""),
                    "\n    faux('test')\n    faux('faux\\ntest')\n    faux('faux\\ntest')",
                );
            });
        });

        it("thisValues", function () {
            const faux = createFaux();
            faux();
            assert.equals(faux.printf("%t"), "undefined");

            faux.resetHistory();
            faux.call(true);
            assert.equals(faux.printf("%t"), "true");
        });

        it("unmatched", function () {
            const faux = createFaux();

            assert.equals(faux.printf("%λ"), "%λ");
        });

        it("*", function () {
            const faux = createFaux();

            assert.equals(
                faux.printf("%*", 1.4567, "a", true, {}, [], undefined, null),
                "1.4567, 'a', true, {}, [], undefined, null",
            );
            assert.equals(faux.printf("%*", "a", "b", "c"), "'a', 'b', 'c'");
        });

        it("supports numeric placeholders", function () {
            const faux = createFaux();

            assert.equals(faux.printf("%1 %2 %q", "a", "b"), "'a' 'b' %q");
        });

        it("returns an empty string when no format is provided", function () {
            const faux = createFaux();

            assert.equals(faux.printf(), "");
        });

        describe("arguments", function () {
            it("no calls", function () {
                const faux = createFaux();

                assert.equals(faux.printf("%D"), "");
            });

            it("single call with arguments", function () {
                const faux = createFaux();

                faux(1, "a", true, false, [], {}, null, undefined);

                assert.equals(
                    faux.printf("%D"),
                    `\n${color.red("1")}\n${color.red("'\"a\"'")}\n${color.red(
                        "true",
                    )}\n${color.red("false")}\n${color.red("[]")}\n${color.red(
                        "{}",
                    )}\n${color.red("null")}\n${color.red("undefined")}`,
                );
            });

            it("single call without arguments", function () {
                const faux = createFaux();

                faux();

                assert.equals(faux.printf("%D"), "");
            });

            it("multiple calls with arguments", function () {
                const faux = createFaux();

                faux(1, "a", true);
                faux(false, [], {});
                faux(null, undefined);

                assert.equals(
                    faux.printf("%D"),
                    `${"\nCall 1:\n"}${color.red("1")}\n${color.red(
                        "'\"a\"'",
                    )}\n${color.red("true")}\nCall 2:` +
                        `\n${color.red("false")}\n${color.red(
                            "[]",
                        )}\n${color.red("{}")}\nCall 3:` +
                        `\n${color.red("null")}\n${color.red("undefined")}`,
                );
            });

            it("multiple calls without arguments", function () {
                const faux = createFaux();

                faux();
                faux();
                faux();

                assert.equals(faux.printf("%D"), "\nCall 1:\nCall 2:\nCall 3:");
            });
        });
    });

    describe("arity handling", function () {
        it("creates proxy wrappers for every declared arity branch", function () {
            for (let arity = 0; arity <= 12; arity++) {
                const original = createArityFunction(arity);
                const proxy = createProxy(original, original);

                assert.equals(proxy.length, arity);
                assert.equals(proxy.call({ marker: arity }), arity);
            }

            const overflow = createArityFunction(13);
            const overflowProxy = createProxy(overflow, overflow);

            assert.equals(overflowProxy.length, 0);
            assert.equals(overflowProxy.call({ marker: 13 }), 13);
        });

        it("keeps the default proxy name when the original name is locked", function () {
            const original = createArityFunction(0);

            Object.defineProperty(original, "name", {
                value: "locked",
                configurable: false,
            });

            const proxy = createProxy(original, original);

            assert.equals(proxy.name, "proxy");
        });

        it("throws when resetHistory is called while the proxy is invoking", function () {
            const state = {};
            const original = function () {
                state.proxy.resetHistory();
            };
            state.proxy = createProxy(original, original);
            const proxy = state.proxy;

            assert.exception(
                function () {
                    proxy();
                },
                { name: "InvalidResetException" },
            );
        });
    });
});
