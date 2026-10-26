import referee from "@sinonjs/referee";
import commons from "@sinonjs/commons";
import createSandbox from "../../src/sinon/create-sandbox.js";
import createApi from "../../src/create-sinon-api.js";
import sinonStub from "../../src/sinon/stub.js";

const { assert, refute } = referee;

describe("Sandbox disposal", function () {
    beforeEach(function () {
        this.sandbox = createSandbox();
        this.object = {
            method: function () {
                return "original";
            },
        };
        this.original = this.object.method;
    });

    afterEach(function () {
        this.sandbox.restore();
    });

    describe("[Symbol.dispose]", function () {
        before(function () {
            if (typeof Symbol.dispose !== "symbol") {
                this.skip();
            }
        });

        it("restores stubs, spies, and replacements", function () {
            const object = {
                stubbed: this.original,
                spied: this.original,
                replaced: this.original,
            };
            this.sandbox.stub(object, "stubbed").returns("stubbed");
            this.sandbox.spy(object, "spied");
            this.sandbox.replace(object, "replaced", function () {
                return "replaced";
            });

            this.sandbox[Symbol.dispose]();

            assert.same(object.stubbed, this.original);
            assert.same(object.spied, this.original);
            assert.same(object.replaced, this.original);
        });

        it("removes properties defined by the sandbox", function () {
            this.sandbox.define(this.object, "temporary", 42);

            this.sandbox[Symbol.dispose]();

            refute("temporary" in this.object);
        });

        it("restores mocks without verifying their expectations", function () {
            this.sandbox.mock(this.object).expects("method").once();

            this.sandbox[Symbol.dispose]();

            assert.same(this.object.method, this.original);
        });

        it("restores fake timers", function () {
            const originalSetTimeout = commons.global.setTimeout;
            this.sandbox.useFakeTimers();

            this.sandbox[Symbol.dispose]();

            assert.same(commons.global.setTimeout, originalSetTimeout);
        });

        it("can be called repeatedly", function () {
            this.sandbox.stub(this.object, "method");

            this.sandbox[Symbol.dispose]();
            this.sandbox[Symbol.dispose]();

            assert.same(this.object.method, this.original);
        });

        it("can be called after manual restoration", function () {
            this.sandbox.stub(this.object, "method");
            this.sandbox.restore();

            this.sandbox[Symbol.dispose]();

            assert.same(this.object.method, this.original);
        });

        it("does not restore another sandbox", function () {
            const otherSandbox = createSandbox();
            const otherObject = { method: this.original };
            try {
                otherSandbox.stub(otherObject, "method").returns("other");
                this.sandbox.stub(this.object, "method");

                this.sandbox[Symbol.dispose]();

                assert.same(this.object.method, this.original);
                assert.equals(otherObject.method(), "other");
            } finally {
                otherSandbox.restore();
            }
        });

        it("supports the default Sinon sandbox", function () {
            const sinon = createApi();
            try {
                sinon.stub(this.object, "method");

                sinon[Symbol.dispose]();

                assert.same(this.object.method, this.original);
            } finally {
                sinon.restore();
            }
        });
    });

    describe("using declarations", function () {
        let usingSandbox;

        before(function () {
            if (typeof Symbol.dispose !== "symbol") {
                this.skip();
            }
            try {
                // Compile separately so older supported parsers can run this file.
                // eslint-disable-next-line no-new-func
                usingSandbox = new Function(
                    "sandbox",
                    "callback",
                    "using resource = sandbox; return callback();",
                );
            } catch (error) {
                if (error instanceof SyntaxError) {
                    this.skip();
                } else {
                    throw error;
                }
            }
        });

        it("restores replacements when leaving the scope", function () {
            const sandbox = this.sandbox;
            const object = this.object;

            usingSandbox(sandbox, function () {
                sandbox.stub(object, "method").returns("temporary");
                assert.equals(object.method(), "temporary");
            });

            assert.same(object.method, this.original);
        });

        it("restores replacements when the scope throws", function () {
            const sandbox = this.sandbox;
            const object = this.object;
            const error = new Error("test failure");
            let caught;

            try {
                usingSandbox(sandbox, function () {
                    sandbox.stub(object, "method");
                    throw error;
                });
            } catch (exception) {
                caught = exception;
            }

            assert.same(caught, error);
            assert.same(object.method, this.original);
        });

        it("allows manual restoration before leaving the scope", function () {
            const sandbox = this.sandbox;
            const object = this.object;

            usingSandbox(sandbox, function () {
                sandbox.stub(object, "method");
                sandbox.restore();
            });

            assert.same(object.method, this.original);
        });

        it("cleans up nested sandboxes independently", function () {
            const sandbox = this.sandbox;
            const object = this.object;
            const otherSandbox = createSandbox();
            const otherObject = { method: this.original };

            try {
                usingSandbox(
                    sandbox,
                    function () {
                        sandbox.stub(object, "method").returns("outer");
                        usingSandbox(otherSandbox, function () {
                            otherSandbox.stub(otherObject, "method");
                        });
                        assert.same(otherObject.method, this.original);
                        assert.equals(object.method(), "outer");
                    }.bind(this),
                );

                assert.same(object.method, this.original);
            } finally {
                otherSandbox.restore();
            }
        });
    });

    it("supports manual cleanup when Symbol.dispose is unavailable", function () {
        const symbolStub = sinonStub(commons.global, "Symbol").value({});
        let sandbox;
        try {
            sandbox = createSandbox();
        } finally {
            symbolStub.restore();
        }

        try {
            sandbox.stub(this.object, "method").returns("temporary");
            assert.equals(this.object.method(), "temporary");
            refute(Object.prototype.hasOwnProperty.call(sandbox, "undefined"));

            sandbox.restore();

            assert.same(this.object.method, this.original);
        } finally {
            sandbox.restore();
        }
    });
});
