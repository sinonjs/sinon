"use strict";

var referee = require("@sinonjs/referee");
var samsam = require("@sinonjs/samsam");
var assert = referee.assert;
var deprecated = require("../lib/sinon/util/core/deprecated");
var refute = referee.refute;
var fakeXhr = require("nise").fakeXhr;
var fakeServerWithClock = require("nise").fakeServerWithClock;
var fakeServer = require("nise").fakeServer;
var match = require("@sinonjs/samsam").createMatcher;
var Sandbox = require("../lib/sinon/sandbox");
var createSandbox = require("../lib/sinon/create-sandbox");
var sinonFake = require("../lib/sinon/fake");
var sinonSpy = require("../lib/sinon/spy");
var sinonStub = require("../lib/sinon/stub");
var sinonConfig = require("../lib/sinon/util/core/get-config");
var sinonAssert = require("../lib/sinon/assert");
var sinonClock = require("../lib/sinon/util/fake-timers");

var supportsAjax = typeof XMLHttpRequest !== "undefined" || typeof ActiveXObject !== "undefined";
var supportPromise = Boolean(global.Promise);
var globalXHR = global.XMLHttpRequest;
var globalAXO = global.ActiveXObject;

if (!assert.stub) {
    require("./test-helper");
}

referee.add("fakeServerWithClock", {
    assert: function(obj, expected) {
        return samsam.deepEqual(obj, expected) && fakeServer.create.calledOn(fakeServerWithClock);
    },
    assertMessage: "Expected object ${0} to be a fake server with clock",
    refuteMessage: "Expected object ${0} not to be a fake server with clock"
});

describe("Sandbox", function() {
    function noop() {
        return;
    }

    it("exposes match", function() {
        var sandbox = new Sandbox();

        assert.same(sandbox.match, match);
    });

    it("exposes assert", function() {
        var sandbox = new Sandbox();

        assert.same(sandbox.assert, sinonAssert);
    });

    it("can be reset without failing when pre-configured to use a fake server", function() {
        var sandbox = createSandbox({ useFakeServer: true });
        refute.exception(function() {
            sandbox.reset();
        });
    });

    it("can be reset without failing when configured to use a fake server", function() {
        var sandbox = new Sandbox();
        sandbox.useFakeServer();
        refute.exception(function() {
            sandbox.reset();
        });
    });

    describe(".mock", function() {
        beforeEach(function() {
            this.sandbox = createSandbox();
        });

        it("returns a mock", function() {
            var object = {
                method: function() {
                    return;
                }
            };

            var actual = this.sandbox.mock(object);
            actual.expects("method");

            assert.equals(typeof actual.verify, "function");
            assert.equals(typeof object.method.restore, "function");
        });

        it("adds mock to fake array", function() {
            var fakes = this.sandbox.getFakes();
            var object = {
                method: function() {
                    return;
                }
            };
            var expected = this.sandbox.mock(object);

            assert(fakes.indexOf(expected) !== -1);
        });

        it("appends mocks to fake array", function() {
            var fakes = this.sandbox.getFakes();

            this.sandbox.mock({});
            this.sandbox.mock({});

            assert.equals(fakes.length, 2);
        });
    });

    describe("stub and mock test", function() {
        beforeEach(function() {
            this.sandbox = createSandbox();
        });

        it("appends mocks and stubs to fake array", function() {
            var fakes = this.sandbox.getFakes();

            this.sandbox.mock(
                {
                    method: function() {
                        return;
                    }
                },
                "method"
            );
            this.sandbox.stub(
                {
                    method: function() {
                        return;
                    }
                },
                "method"
            );

            assert.equals(fakes.length, 2);
        });
    });

    describe(".spy", function() {
        it("should return a spy", function() {
            var sandbox = createSandbox();
            var spy = sandbox.spy();

            assert.isFunction(spy);
            assert.equals(spy.displayName, "spy");
        });

        it("should add a spy to the internal collection", function() {
            var sandbox = createSandbox();
            var fakes = sandbox.getFakes();
            var expected;

            expected = sandbox.spy();

            assert.isTrue(fakes.indexOf(expected) !== -1);
        });
    });

    describe(".createStubInstance", function() {
        beforeEach(function() {
            this.sandbox = createSandbox();
        });

        it("stubs existing methods", function() {
            var Class = function() {
                return;
            };
            Class.prototype.method = function() {
                return;
            };

            var stub = this.sandbox.createStubInstance(Class);
            stub.method.returns(3);
            assert.equals(3, stub.method());
        });

        it("should require a function", function() {
            var sandbox = this.sandbox;

            assert.exception(
                function() {
                    sandbox.createStubInstance("not a function");
                },
                {
                    name: "TypeError",
                    message: "The constructor should be a function."
                }
            );
        });

        it("resets all stub methods on reset()", function() {
            var Class = function() {
                return;
            };
            Class.prototype.method1 = function() {
                return;
            };
            Class.prototype.method2 = function() {
                return;
            };
            Class.prototype.method3 = function() {
                return;
            };

            var stub = this.sandbox.createStubInstance(Class);
            stub.method1.returns(1);
            stub.method2.returns(2);
            stub.method3.returns(3);

            assert.equals(3, stub.method3());

            this.sandbox.reset();
            assert.equals(undefined, stub.method1());
            assert.equals(undefined, stub.method2());
            assert.equals(undefined, stub.method3());
        });

        it("doesn't stub fake methods", function() {
            var Class = function() {
                return;
            };

            var stub = this.sandbox.createStubInstance(Class);
            assert.exception(function() {
                stub.method.returns(3);
            });
        });

        it("doesn't call the constructor", function() {
            var Class = function(a, b) {
                var c = a + b;
                throw c;
            };
            Class.prototype.method = function() {
                return;
            };

            var stub = this.sandbox.createStubInstance(Class);
            refute.exception(function() {
                stub.method(3);
            });
        });

        it("retains non function values", function() {
            var TYPE = "some-value";
            var Class = function() {
                return;
            };
            Class.prototype.type = TYPE;

            var stub = this.sandbox.createStubInstance(Class);
            assert.equals(TYPE, stub.type);
        });

        it("has no side effects on the prototype", function() {
            var proto = {
                method: function() {
                    throw new Error("error");
                }
            };
            var Class = function() {
                return;
            };
            Class.prototype = proto;

            var stub = this.sandbox.createStubInstance(Class);
            refute.exception(stub.method);
            assert.exception(proto.method);
        });

        it("throws exception for non function params", function() {
            var types = [{}, 3, "hi!"];

            for (var i = 0; i < types.length; i++) {
                // yes, it's silly to create functions in a loop, it's also a test
                /* eslint-disable-next-line ie11/no-loop-func, no-loop-func */
                assert.exception(function() {
                    this.sandbox.createStubInstance(types[i]);
                });
            }
        });
    });

    describe(".stub", function() {
        beforeEach(function() {
            this.sandbox = createSandbox();
        });

        it("fails if stubbing property on null", function() {
            var sandbox = this.sandbox;

            assert.exception(
                function() {
                    sandbox.stub(null, "prop");
                },
                {
                    message: "Trying to stub property 'prop' of null"
                }
            );
        });

        it("fails if stubbing symbol on null", function() {
            if (typeof Symbol === "function") {
                var sandbox = this.sandbox;

                assert.exception(
                    function() {
                        sandbox.stub(null, Symbol());
                    },
                    {
                        message: "Trying to stub property 'Symbol()' of null"
                    }
                );
            }
        });

        it("creates a stub", function() {
            var object = {
                method: function() {
                    return;
                }
            };

            this.sandbox.stub(object, "method");

            assert.equals(typeof object.method.restore, "function");
        });

        it("adds stub to fake array", function() {
            var fakes = this.sandbox.getFakes();
            var object = {
                method: function() {
                    return;
                }
            };
            var stub = this.sandbox.stub(object, "method");

            assert.isTrue(fakes.indexOf(stub) !== -1);
        });

        it("appends stubs to fake array", function() {
            var fakes = this.sandbox.getFakes();

            this.sandbox.stub(
                {
                    method: function() {
                        return;
                    }
                },
                "method"
            );
            this.sandbox.stub(
                {
                    method: function() {
                        return;
                    }
                },
                "method"
            );

            assert.equals(fakes.length, 2);
        });

        it("adds all object methods to fake array", function() {
            var fakes = this.sandbox.getFakes();
            var object = {
                method: function() {
                    return;
                },
                method2: function() {
                    return;
                },
                method3: function() {
                    return;
                }
            };

            Object.defineProperty(object, "method3", {
                enumerable: false
            });

            this.sandbox.stub(object);

            assert.isTrue(fakes.indexOf(object.method) !== -1);
            assert.isTrue(fakes.indexOf(object.method2) !== -2);
            assert.isTrue(fakes.indexOf(object.method3) !== -3);
            assert.equals(fakes.length, 3);
        });

        it("returns a stubbed object", function() {
            var object = {
                method: function() {
                    return;
                }
            };
            assert.equals(this.sandbox.stub(object), object);
        });

        it("returns a stubbed method", function() {
            var object = {
                method: function() {
                    return;
                }
            };
            assert.equals(this.sandbox.stub(object, "method"), object.method);
        });

        if (typeof process !== "undefined") {
            describe("on node", function() {
                beforeEach(function() {
                    process.env.HELL = "Ain't too bad";
                });

                it("stubs environment property", function() {
                    var originalPrintWarning = deprecated.printWarning;
                    deprecated.printWarning = function() {
                        return;
                    };

                    this.sandbox.stub(process.env, "HELL").value("froze over");
                    assert.equals(process.env.HELL, "froze over");

                    deprecated.printWarning = originalPrintWarning;
                });
            });
        }
    });

    describe("stub anything", function() {
        beforeEach(function() {
            this.object = { property: 42 };
            this.sandbox = new Sandbox();
        });

        it("stubs number property", function() {
            var originalPrintWarning = deprecated.printWarning;
            deprecated.printWarning = function() {
                return;
            };

            this.sandbox.stub(this.object, "property").value(1);

            assert.equals(this.object.property, 1);

            deprecated.printWarning = originalPrintWarning;
        });

        it("restores number property", function() {
            var originalPrintWarning = deprecated.printWarning;
            deprecated.printWarning = function() {
                return;
            };

            this.sandbox.stub(this.object, "property").value(1);
            this.sandbox.restore();

            assert.equals(this.object.property, 42);

            deprecated.printWarning = originalPrintWarning;
        });

        it("fails if property does not exist", function() {
            var originalPrintWarning = deprecated.printWarning;
            deprecated.printWarning = function() {
                return;
            };

            var sandbox = this.sandbox;
            var object = {};

            assert.exception(function() {
                sandbox.stub(object, "prop", 1);
            });

            deprecated.printWarning = originalPrintWarning;
        });

        it("fails if Symbol does not exist", function() {
            if (typeof Symbol === "function") {
                var sandbox = this.sandbox;
                var object = {};

                var originalPrintWarning = deprecated.printWarning;
                deprecated.printWarning = function() {
                    return;
                };

                assert.exception(
                    function() {
                        sandbox.stub(object, Symbol());
                    },
                    { message: "Cannot stub non-existent own property Symbol()" },
                    TypeError
                );

                deprecated.printWarning = originalPrintWarning;
            }
        });
    });

    describe(".fake", function() {
        it("should return a fake", function() {
            var sandbox = createSandbox();
            var fake = sandbox.fake();

            assert.isFunction(fake);
            assert.equals(fake.displayName, "fake");
        });

        it("should add a fake to the internal collection", function() {
            var sandbox = createSandbox();
            var fakes = sandbox.getFakes();
            var expected;

            expected = sandbox.fake();

            assert.isTrue(fakes.indexOf(expected) !== -1);
        });

        describe(".returns", function() {
            it("should return a fake behavior", function() {
                var sandbox = createSandbox();
                var fake = sandbox.fake.returns();

                assert.isFunction(fake);
                assert.equals(fake.displayName, "fake");
            });

            it("should add a fake behavior to the internal collection", function() {
                var sandbox = createSandbox();
                var fakes = sandbox.getFakes();
                var expected;

                expected = sandbox.fake.returns();

                assert.isTrue(fakes.indexOf(expected) !== -1);
            });
        });

        describe(".throws", function() {
            it("should return a fake behavior", function() {
                var sandbox = createSandbox();
                var fake = sandbox.fake.throws();

                assert.isFunction(fake);
                assert.equals(fake.displayName, "fake");
            });

            it("should add a fake behavior to the internal collection", function() {
                var sandbox = createSandbox();
                var fakes = sandbox.getFakes();
                var expected;

                expected = sandbox.fake.throws();

                assert.isTrue(fakes.indexOf(expected) !== -1);
            });
        });

        describe(".resolves", function() {
            it("should return a fake behavior", function() {
                var sandbox = createSandbox();
                var fake = sandbox.fake.resolves();

                assert.isFunction(fake);
                assert.equals(fake.displayName, "fake");
            });

            it("should add a fake behavior to the internal collection", function() {
                var sandbox = createSandbox();
                var fakes = sandbox.getFakes();
                var expected;

                expected = sandbox.fake.resolves();

                assert.isTrue(fakes.indexOf(expected) !== -1);
            });
        });

        describe(".rejects", function() {
            it("should return a fake behavior", function() {
                var sandbox = createSandbox();
                var fake = sandbox.fake.rejects();

                assert.isFunction(fake);
                assert.equals(fake.displayName, "fake");
            });

            it("should add a fake behavior to the internal collection", function() {
                var sandbox = createSandbox();
                var fakes = sandbox.getFakes();
                var expected;

                expected = sandbox.fake.rejects();

                assert.isTrue(fakes.indexOf(expected) !== -1);
            });
        });

        describe(".yields", function() {
            it("should return a fake behavior", function() {
                var sandbox = createSandbox();
                var fake = sandbox.fake.yields();

                assert.isFunction(fake);
                assert.equals(fake.displayName, "fake");
            });

            it("should add a fake behavior to the internal collection", function() {
                var sandbox = createSandbox();
                var fakes = sandbox.getFakes();
                var expected;

                expected = sandbox.fake.yields();

                assert.isTrue(fakes.indexOf(expected) !== -1);
            });
        });

        describe(".yieldsAsync", function() {
            it("should return a fake behavior", function() {
                var sandbox = createSandbox();
                var fake = sandbox.fake.yieldsAsync();

                assert.isFunction(fake);
                assert.equals(fake.displayName, "fake");
            });

            it("should add a fake behavior to the internal collection", function() {
                var sandbox = createSandbox();
                var fakes = sandbox.getFakes();
                var expected;

                expected = sandbox.fake.yieldsAsync();

                assert.isTrue(fakes.indexOf(expected) !== -1);
            });
        });
    });

    describe(".verifyAndRestore", function() {
        beforeEach(function() {
            this.sandbox = createSandbox();
        });

        it("calls verify and restore", function() {
            this.sandbox.verify = sinonSpy();
            this.sandbox.restore = sinonSpy();

            this.sandbox.verifyAndRestore();

            assert(this.sandbox.verify.called);
            assert(this.sandbox.restore.called);
        });

        it("throws when restore throws", function() {
            this.sandbox.verify = sinonSpy();
            this.sandbox.restore = sinonStub().throws();

            assert.exception(function() {
                this.sandbox.verifyAndRestore();
            });
        });

        it("calls restore when restore throws", function() {
            var sandbox = this.sandbox;

            sandbox.verify = sinonSpy();
            sandbox.restore = sinonStub().throws();

            assert.exception(function() {
                sandbox.verifyAndRestore();
            });

            assert(sandbox.restore.called);
        });
    });

    describe(".replace", function() {
        beforeEach(function() {
            this.sandbox = createSandbox();
        });

        it("should replace a function property", function() {
            var replacement = function replacement() {
                return;
            };
            var existing = function existing() {
                return;
            };
            var object = {
                property: existing
            };

            this.sandbox.replace(object, "property", replacement);

            assert.equals(object.property, replacement);

            this.sandbox.restore();

            assert.equals(object.property, existing);
        });

        it("should replace a non-function property", function() {
            var replacement = "replacement";
            var existing = "existing";
            var object = {
                property: existing
            };

            this.sandbox.replace(object, "property", replacement);

            assert.equals(object.property, replacement);

            this.sandbox.restore();

            assert.equals(object.property, existing);
        });

        it("should replace an inherited property", function() {
            var replacement = "replacement";
            var existing = "existing";
            var object = Object.create({
                property: existing
            });

            this.sandbox.replace(object, "property", replacement);

            assert.equals(object.property, replacement);

            this.sandbox.restore();

            assert.equals(object.property, existing);
        });

        it("should error on missing descriptor", function() {
            var sandbox = this.sandbox;

            assert.exception(
                function() {
                    sandbox.replace({}, "i-dont-exist");
                },
                {
                    message: "Cannot replace non-existent own property i-dont-exist",
                    name: "TypeError"
                }
            );
        });

        it("should error on missing replacement", function() {
            var sandbox = this.sandbox;
            var object = Object.create({
                property: "catpants"
            });

            assert.exception(
                function() {
                    sandbox.replace(object, "property");
                },
                {
                    message: "Expected replacement argument to be defined",
                    name: "TypeError"
                }
            );
        });

        it("should refuse to replace a non-function with a function", function() {
            var sandbox = this.sandbox;
            var replacement = function() {
                return "replacement";
            };
            var existing = "existing";
            var object = {
                property: existing
            };

            assert.exception(
                function() {
                    sandbox.replace(object, "property", replacement);
                },
                { message: "Cannot replace string with function" }
            );
        });

        it("should refuse to replace a function with a non-function", function() {
            var sandbox = this.sandbox;
            var replacement = "replacement";
            var object = {
                property: function() {
                    return "apple pie";
                }
            };

            assert.exception(
                function() {
                    sandbox.replace(object, "property", replacement);
                },
                { message: "Cannot replace function with string" }
            );
        });

        it("should refuse to replace a fake twice", function() {
            var sandbox = this.sandbox;
            var object = {
                property: function() {
                    return "apple pie";
                }
            };

            sandbox.replace(object, "property", sinonFake());

            assert.exception(
                function() {
                    sandbox.replace(object, "property", sinonFake());
                },
                { message: "Attempted to replace property which is already replaced" }
            );
        });

        it("should refuse to replace a string twice", function() {
            var sandbox = this.sandbox;
            var object = {
                property: "original"
            };

            sandbox.replace(object, "property", "first");

            assert.exception(
                function() {
                    sandbox.replace(object, "property", "second");
                },
                { message: "Attempted to replace property which is already replaced" }
            );
        });

        it("should return the replacement argument", function() {
            var replacement = "replacement";
            var existing = "existing";
            var object = {
                property: existing
            };

            var actual = this.sandbox.replace(object, "property", replacement);

            assert.equals(actual, replacement);
        });

        describe("when asked to replace a getter", function() {
            it("should throw an Error", function() {
                var sandbox = this.sandbox;
                var object = {
                    get foo() {
                        return "bar";
                    }
                };

                assert.exception(
                    function() {
                        sandbox.replace(object, "foo", sinonFake());
                    },
                    { message: "Use sandbox.replaceGetter for replacing getters" }
                );
            });
        });

        describe("when asked to replace a setter", function() {
            it("should throw an Error", function() {
                var sandbox = this.sandbox;
                // eslint-disable-next-line accessor-pairs
                var object = {
                    set foo(value) {
                        this.prop = value;
                    }
                };

                assert.exception(
                    function() {
                        sandbox.replace(object, "foo", sinonFake());
                    },
                    { message: "Use sandbox.replaceSetter for replacing setters" }
                );
            });
        });
    });

    describe(".replaceGetter", function() {
        beforeEach(function() {
            this.sandbox = createSandbox();
        });

        it("should replace getters", function() {
            var expected = "baz";
            var object = {
                get foo() {
                    return "bar";
                }
            };

            this.sandbox.replaceGetter(object, "foo", sinonFake.returns(expected));

            assert.equals(object.foo, expected);
        });

        it("should return replacement", function() {
            var replacement = sinonFake.returns("baz");
            var object = {
                get foo() {
                    return "bar";
                }
            };

            var actual = this.sandbox.replaceGetter(object, "foo", replacement);

            assert.equals(actual, replacement);
        });

        it("should replace an inherited property", function() {
            var expected = "baz";
            var replacement = sinonFake.returns(expected);
            var existing = "existing";
            var object = Object.create({
                get foo() {
                    return existing;
                }
            });

            this.sandbox.replaceGetter(object, "foo", replacement);

            assert.equals(object.foo, expected);

            this.sandbox.restore();

            assert.equals(object.foo, existing);
        });

        it("should error on missing descriptor", function() {
            var sandbox = this.sandbox;

            assert.exception(
                function() {
                    sandbox.replaceGetter({}, "i-dont-exist");
                },
                {
                    message: "Cannot replace non-existent own property i-dont-exist",
                    name: "TypeError"
                }
            );
        });

        it("should error when descriptor has no getter", function() {
            var sandbox = this.sandbox;
            // eslint-disable-next-line accessor-pairs
            var object = {
                set catpants(_) {
                    return;
                }
            };

            assert.exception(
                function() {
                    sandbox.replaceGetter(object, "catpants", noop);
                },
                {
                    message: "`object.property` is not a getter",
                    name: "Error"
                }
            );
        });

        describe("when called with a non-function replacement argument", function() {
            it("should throw a TypeError", function() {
                var sandbox = this.sandbox;
                var expected = "baz";
                var object = {
                    get foo() {
                        return "bar";
                    }
                };

                assert.exception(
                    function() {
                        sandbox.replaceGetter(object, "foo", expected);
                    },
                    { message: "Expected replacement argument to be a function" }
                );
            });
        });

        it("allows restoring getters", function() {
            var expected = "baz";
            var object = {
                get foo() {
                    return "bar";
                }
            };

            this.sandbox.replaceGetter(object, "foo", sinonFake.returns(expected));

            this.sandbox.restore();

            assert.equals(object.foo, "bar");
        });

        it("should refuse to replace a getter twice", function() {
            var sandbox = this.sandbox;
            var object = {
                get foo() {
                    return "bar";
                }
            };

            sandbox.replaceGetter(object, "foo", sinonFake.returns("one"));

            assert.exception(
                function() {
                    sandbox.replaceGetter(object, "foo", sinonFake.returns("two"));
                },
                { message: "Attempted to replace foo which is already replaced" }
            );
        });
    });

    describe(".replaceSetter", function() {
        beforeEach(function() {
            this.sandbox = createSandbox();
        });

        it("should replace setter", function() {
            // eslint-disable-next-line accessor-pairs
            var object = {
                set foo(value) {
                    this.prop = value;
                },
                prop: "bar"
            };

            this.sandbox.replaceSetter(object, "foo", function(val) {
                this.prop = val + "bla";
            });

            object.foo = "bla";

            assert.equals(object.prop, "blabla");
        });

        it("should return replacement", function() {
            // eslint-disable-next-line accessor-pairs
            var object = {
                set foo(value) {
                    this.prop = value;
                },
                prop: "bar"
            };
            var replacement = function(val) {
                this.prop = val + "bla";
            };
            var actual = this.sandbox.replaceSetter(object, "foo", replacement);

            assert.equals(actual, replacement);
        });

        it("should replace an inherited property", function() {
            // eslint-disable-next-line accessor-pairs
            var object = Object.create({
                set foo(value) {
                    this.prop = value;
                },
                prop: "bar"
            });
            var replacement = function(value) {
                this.prop = value + "blabla";
            };

            this.sandbox.replaceSetter(object, "foo", replacement);
            object.foo = "doodle";
            assert.equals(object.prop, "doodleblabla");

            this.sandbox.restore();
            object.foo = "doodle";
            assert.equals(object.prop, "doodle");
        });

        it("should error on missing descriptor", function() {
            var sandbox = this.sandbox;

            assert.exception(
                function() {
                    sandbox.replaceSetter({}, "i-dont-exist");
                },
                {
                    message: "Cannot replace non-existent own property i-dont-exist",
                    name: "TypeError"
                }
            );
        });

        it("should error when descriptor has no setter", function() {
            var sandbox = this.sandbox;
            var object = {
                get catpants() {
                    return;
                }
            };

            assert.exception(
                function() {
                    sandbox.replaceSetter(object, "catpants", noop);
                },
                {
                    message: "`object.property` is not a setter",
                    name: "Error"
                }
            );
        });

        describe("when called with a non-function replacement argument", function() {
            it("should throw a TypeError", function() {
                var sandbox = this.sandbox;
                // eslint-disable-next-line accessor-pairs
                var object = {
                    set foo(value) {
                        this.prop = value;
                    },
                    prop: "bar"
                };

                assert.exception(
                    function() {
                        sandbox.replaceSetter(object, "foo", "bla");
                    },
                    { message: "Expected replacement argument to be a function" }
                );
            });
        });

        it("allows restoring setters", function() {
            // eslint-disable-next-line accessor-pairs
            var object = {
                set foo(value) {
                    this.prop = value;
                },
                prop: "bar"
            };

            this.sandbox.replaceSetter(object, "foo", function(val) {
                this.prop = val + "bla";
            });

            this.sandbox.restore();

            object.prop = "bla";

            assert.equals(object.prop, "bla");
        });

        it("should refuse to replace a setter twice", function() {
            var sandbox = this.sandbox;
            // eslint-disable-next-line accessor-pairs
            var object = {
                set foo(value) {
                    return;
                }
            };

            sandbox.replaceSetter(object, "foo", sinonFake());

            assert.exception(
                function() {
                    sandbox.replaceSetter(object, "foo", sinonFake.returns("two"));
                },
                { message: "Attempted to replace foo which is already replaced" }
            );
        });
    });

    describe(".reset", function() {
        beforeEach(function() {
            var sandbox = (this.sandbox = createSandbox());
            var fakes = sandbox.getFakes();

            fakes.push({
                reset: sinonSpy(),
                resetHistory: sinonSpy()
            });
            fakes.push({
                reset: sinonSpy(),
                resetHistory: sinonSpy()
            });
        });

        it("calls reset on all fakes", function() {
            var fake0 = this.sandbox.getFakes()[0];
            var fake1 = this.sandbox.getFakes()[1];

            this.sandbox.reset();

            assert(fake0.reset.called);
            assert(fake1.reset.called);
        });

        it("calls resetHistory on all fakes", function() {
            var fake0 = this.sandbox.getFakes()[0];
            var fake1 = this.sandbox.getFakes()[1];

            this.sandbox.reset();

            assert(fake0.resetHistory.called);
            assert(fake1.resetHistory.called);
        });

        it("resets fake behaviours", function() {
            var fake = this.sandbox.fake();
            fake(1234);

            this.sandbox.reset();

            assert.equals(fake.getCalls(), []);
        });
    });

    describe(".resetBehavior", function() {
        beforeEach(function() {
            var sandbox = (this.sandbox = createSandbox());
            var fakes = sandbox.getFakes();

            fakes.push({ resetBehavior: sinonSpy() });
            fakes.push({ resetBehavior: sinonSpy() });
        });

        it("calls resetBehavior on all fakes", function() {
            var fake0 = this.sandbox.getFakes()[0];
            var fake1 = this.sandbox.getFakes()[1];

            this.sandbox.resetBehavior();

            assert(fake0.resetBehavior.called);
            assert(fake1.resetBehavior.called);
        });
    });

    describe(".resetHistory", function() {
        beforeEach(function() {
            var sandbox = (this.sandbox = createSandbox());
            var fakes = (this.fakes = sandbox.getFakes());

            var spy1 = sinonSpy();
            spy1();
            fakes.push(spy1);

            var spy2 = sinonSpy();
            spy2();
            fakes.push(spy2);
        });

        it("resets the history on all fakes", function() {
            var fake0 = this.fakes[0];
            var fake1 = this.fakes[1];

            this.sandbox.resetHistory();

            refute(fake0.called);
            refute(fake1.called);
        });

        it("calls reset on fake that does not have a resetHistory", function() {
            noop.reset = function reset() {
                noop.reset.called = true;
            };

            this.fakes.push(noop);

            this.sandbox.resetHistory();

            assert.isTrue(noop.reset.called);
        });
    });

    describe(".useFakeTimers", function() {
        beforeEach(function() {
            this.sandbox = new Sandbox();
        });

        afterEach(function() {
            this.sandbox.restore();
        });

        it("returns clock object", function() {
            var clock = this.sandbox.useFakeTimers();

            assert.isObject(clock);
            assert.isFunction(clock.tick);
        });

        it("exposes clock property", function() {
            this.sandbox.useFakeTimers();

            assert.isObject(this.sandbox.clock);
            assert.isFunction(this.sandbox.clock.tick);
        });

        it("uses restorable clock", function() {
            this.sandbox.useFakeTimers();

            assert.clock(this.sandbox.clock);
        });

        it("passes arguments to sinon.useFakeTimers", function() {
            var useFakeTimersStub = sinonStub(sinonClock, "useFakeTimers").returns({});

            this.sandbox.useFakeTimers({ toFake: ["Date", "setTimeout"] });
            this.sandbox.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval"] });

            assert(useFakeTimersStub.calledWith({ toFake: ["Date", "setTimeout"] }));
            assert(useFakeTimersStub.calledWith({ toFake: ["setTimeout", "clearTimeout", "setInterval"] }));

            useFakeTimersStub.restore();
        });

        it("restores the fakeTimer clock created by the sandbox when the sandbox is restored", function() {
            var originalSetTimeout = setTimeout;

            this.sandbox.useFakeTimers();
            refute.same(setTimeout, originalSetTimeout, "fakeTimers installed");

            this.sandbox.restore();

            assert.same(setTimeout, originalSetTimeout, "fakeTimers restored");
        });

        it("restores spied fake timers when then sanddox is restored", function() {
            var originalSetTimeout = setTimeout;

            this.sandbox.useFakeTimers();
            this.sandbox.spy(global, "setTimeout");

            this.sandbox.restore();

            assert.same(originalSetTimeout, global.setTimeout, "fakeTimers restored");
        });
    });

    describe(".usingPromise", function() {
        beforeEach(function() {
            this.sandbox = new Sandbox();
        });

        afterEach(function() {
            this.sandbox.restore();
        });

        it("must be a function", function() {
            assert.isFunction(this.sandbox.usingPromise);
        });

        it("must return the sandbox", function() {
            var mockPromise = {};

            var actual = this.sandbox.usingPromise(mockPromise);

            assert.same(actual, this.sandbox);
        });

        it("must set all stubs created from sandbox with mockPromise", function() {
            if (!supportPromise) {
                return this.skip();
            }

            var resolveValue = {};
            var mockPromise = {
                resolve: sinonStub.create().resolves(resolveValue)
            };

            this.sandbox.usingPromise(mockPromise);
            var stub = this.sandbox.stub().resolves();

            return stub().then(function(action) {
                assert.same(resolveValue, action);
                assert(mockPromise.resolve.calledOnce);
            });
        });

        // eslint-disable-next-line mocha/no-identical-title
        it("must set all stubs created from sandbox with mockPromise", function() {
            if (!supportPromise) {
                return this.skip();
            }

            var resolveValue = {};
            var mockPromise = {
                resolve: sinonStub.create().resolves(resolveValue)
            };
            var stubbedObject = {
                stubbedMethod: function() {
                    return;
                }
            };

            this.sandbox.usingPromise(mockPromise);
            this.sandbox.stub(stubbedObject);
            stubbedObject.stubbedMethod.resolves({});

            return stubbedObject.stubbedMethod().then(function(action) {
                assert.same(resolveValue, action);
                assert(mockPromise.resolve.calledOnce);
            });
        });

        it("must set all mocks created from sandbox with mockPromise", function() {
            if (!supportPromise) {
                return this.skip();
            }

            var resolveValue = {};
            var mockPromise = {
                resolve: sinonStub.create().resolves(resolveValue)
            };
            var mockedObject = {
                mockedMethod: function() {
                    return;
                }
            };

            this.sandbox.usingPromise(mockPromise);
            var mock = this.sandbox.mock(mockedObject);
            mock.expects("mockedMethod").resolves({});

            return mockedObject.mockedMethod().then(function(action) {
                assert.same(resolveValue, action);
                assert(mockPromise.resolve.calledOnce);
            });
        });
    });

    // These were not run in browsers before, as we were only testing in node
    if (typeof window !== "undefined") {
        describe("fake XHR/server", function() {
            describe(".useFakeXMLHttpRequest", function() {
                beforeEach(function() {
                    this.sandbox = new Sandbox();
                });

                afterEach(function() {
                    this.sandbox.restore();
                });

                it("calls sinon.useFakeXMLHttpRequest", function() {
                    var stubXhr = {
                        restore: function() {
                            return;
                        }
                    };

                    this.sandbox.stub(fakeXhr, "useFakeXMLHttpRequest").returns(stubXhr);
                    var returnedXhr = this.sandbox.useFakeXMLHttpRequest();

                    assert(fakeXhr.useFakeXMLHttpRequest.called);
                    assert.equals(stubXhr, returnedXhr);
                });

                it("returns fake xhr object created by nise", function() {
                    this.sandbox.stub(fakeXhr, "useFakeXMLHttpRequest").returns({
                        restore: function() {
                            return;
                        }
                    });
                    this.sandbox.useFakeXMLHttpRequest();

                    assert(fakeXhr.useFakeXMLHttpRequest.called);
                });

                it("doesn't secretly use useFakeServer", function() {
                    this.sandbox.stub(fakeServer, "create").returns({
                        restore: function() {
                            return;
                        }
                    });
                    this.sandbox.useFakeXMLHttpRequest();

                    assert(fakeServer.create.notCalled);
                });

                it("adds fake xhr to fake collection", function() {
                    this.sandbox.useFakeXMLHttpRequest();
                    this.sandbox.restore();

                    assert.same(global.XMLHttpRequest, globalXHR);
                    assert.same(global.ActiveXObject, globalAXO);
                });
            });

            describe(".useFakeServer", function() {
                beforeEach(function() {
                    this.sandbox = new Sandbox();
                });

                afterEach(function() {
                    this.sandbox.restore();
                });

                it("returns server", function() {
                    var server = this.sandbox.useFakeServer();

                    assert.isObject(server);
                    assert.isFunction(server.restore);
                });

                it("exposes server property", function() {
                    var server = this.sandbox.useFakeServer();

                    assert.same(this.sandbox.server, server);
                });

                it("creates server", function() {
                    var server = this.sandbox.useFakeServer();

                    assert(fakeServer.isPrototypeOf(server));
                });

                it("creates server without clock by default", function() {
                    var server = this.sandbox.useFakeServer();

                    refute(fakeServerWithClock.isPrototypeOf(server));
                });

                it("creates server with clock", function() {
                    this.sandbox.serverPrototype = fakeServerWithClock;
                    var server = this.sandbox.useFakeServer();

                    assert(fakeServerWithClock.isPrototypeOf(server));
                });

                it("adds server to fake collection", function() {
                    this.sandbox.useFakeServer();
                    this.sandbox.restore();

                    assert.same(global.XMLHttpRequest, globalXHR);
                    assert.same(global.ActiveXObject, globalAXO);
                });
            });
        });
    }

    describe(".inject", function() {
        beforeEach(function() {
            this.obj = {};
            this.sandbox = new Sandbox();
        });

        afterEach(function() {
            this.sandbox.restore();
        });

        it("injects spy, stub, mock", function() {
            this.sandbox.inject(this.obj);

            assert.isFunction(this.obj.spy);
            assert.isFunction(this.obj.stub);
            assert.isFunction(this.obj.mock);
        });

        it("does not define clock, server and requests objects", function() {
            this.sandbox.inject(this.obj);

            assert.isFalse("clock" in this.obj);
            assert.isFalse("server" in this.obj);
            assert.isFalse("requests" in this.obj);
        });

        it("defines clock when using fake time", function() {
            this.sandbox.useFakeTimers();
            this.sandbox.inject(this.obj);

            assert.isFunction(this.obj.spy);
            assert.isFunction(this.obj.stub);
            assert.isFunction(this.obj.mock);
            assert.isObject(this.obj.clock);
            assert.isFalse("server" in this.obj);
            assert.isFalse("requests" in this.obj);
        });

        it("should return object", function() {
            var injected = this.sandbox.inject({});

            assert.isObject(injected);
            assert.isFunction(injected.spy);
        });

        if (supportsAjax) {
            describe("ajax options", function() {
                it("defines server and requests when using fake time", function() {
                    this.sandbox.useFakeServer();
                    this.sandbox.inject(this.obj);

                    assert.isFunction(this.obj.spy);
                    assert.isFunction(this.obj.stub);
                    assert.isFunction(this.obj.mock);
                    assert.isFalse("clock" in this.obj);
                    assert.isObject(this.obj.server);
                    assert.equals(this.obj.requests, []);
                });

                it("should define all possible fakes", function() {
                    this.sandbox.useFakeServer();
                    this.sandbox.useFakeTimers();
                    this.sandbox.inject(this.obj);

                    var spy = sinonSpy();
                    setTimeout(spy, 10);

                    this.sandbox.clock.tick(10);

                    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"); //eslint-disable-line no-undef

                    assert.isFunction(this.obj.spy);
                    assert.isFunction(this.obj.stub);
                    assert.isFunction(this.obj.mock);
                    assert(spy.called);
                    assert.isObject(this.obj.server);
                    assert.equals(this.obj.requests, [xhr]);
                });
            });
        }
    });

    describe(".verify", function() {
        it("calls verify on all fakes", function() {
            var sandbox = createSandbox();
            var fakes = sandbox.getFakes();

            fakes.push({ verify: sinonSpy() });
            fakes.push({ verify: sinonSpy() });

            sandbox.verify();

            fakes.forEach(function(f) {
                assert(f.verify.calledOnce);
            });
        });
    });

    describe(".restore", function() {
        it("throws when passed arguments", function() {
            var sandbox = new Sandbox();

            assert.exception(
                function() {
                    sandbox.restore("args");
                },
                {
                    message: "sandbox.restore() does not take any parameters. Perhaps you meant stub.restore()"
                }
            );
        });
    });

    describe("configurable sandbox", function() {
        beforeEach(function() {
            this.requests = [];
            this.fakeServer = { requests: this.requests };

            this.useFakeTimersSpy = sinonSpy(sinonClock, "useFakeTimers");
            sinonStub(fakeServer, "create").returns(this.fakeServer);
        });

        afterEach(function() {
            this.useFakeTimersSpy.restore();
            fakeServer.create.restore();
        });

        it("yields stub, mock as arguments", function() {
            var sandbox = createSandbox(
                sinonConfig({
                    injectIntoThis: false,
                    properties: ["stub", "mock"]
                })
            );

            assert.equals(sandbox.args.length, 2);
            assert.stub(sandbox.args[0]());
            assert.mock(sandbox.args[1]({}));

            sandbox.restore();
        });

        it("yields spy, stub, mock as arguments", function() {
            var sandbox = createSandbox(
                sinonConfig({
                    injectIntoThis: false,
                    properties: ["spy", "stub", "mock"]
                })
            );

            assert.spy(sandbox.args[0]());
            assert.stub(sandbox.args[1]());
            assert.mock(sandbox.args[2]({}));

            sandbox.restore();
        });

        it("does not yield server when not faking xhr", function() {
            var sandbox = createSandbox(
                sinonConfig({
                    injectIntoThis: false,
                    properties: ["server", "stub", "mock"],
                    useFakeServer: false
                })
            );

            assert.equals(sandbox.args.length, 2);
            assert.stub(sandbox.args[0]());
            assert.mock(sandbox.args[1]({}));

            sandbox.restore();
        });

        it("does not inject properties if they are already present", function() {
            var server = function() {
                return;
            };
            var clock = {};
            var spy = false;
            var object = { server: server, clock: clock, spy: spy };
            var sandbox = createSandbox(
                sinonConfig({
                    properties: ["server", "clock", "spy"],
                    injectInto: object
                })
            );

            assert.same(object.server, server);
            assert.same(object.clock, clock);
            assert.same(object.spy, spy);

            sandbox.restore();
        });

        if (supportsAjax) {
            describe("ajax options", function() {
                it("yields server when faking xhr", function() {
                    var sandbox = createSandbox(
                        sinonConfig({
                            injectIntoThis: false,
                            properties: ["server", "stub", "mock"]
                        })
                    );

                    assert.equals(sandbox.args.length, 3);
                    assert.equals(sandbox.args[0], this.fakeServer);
                    assert.stub(sandbox.args[1]());
                    assert.mock(sandbox.args[2]({}));

                    sandbox.restore();
                });

                it("uses serverWithClock when faking xhr", function() {
                    var sandbox = createSandbox(
                        sinonConfig({
                            injectIntoThis: false,
                            properties: ["server"],
                            useFakeServer: fakeServerWithClock
                        })
                    );

                    assert.fakeServerWithClock(sandbox.args[0], this.fakeServer);

                    sandbox.restore();
                });

                it("uses fakeServer as the serverPrototype by default", function() {
                    var sandbox = createSandbox();

                    assert.same(sandbox.serverPrototype, fakeServer);
                });

                it("uses configured implementation as the serverPrototype", function() {
                    var sandbox = createSandbox({
                        useFakeServer: fakeServerWithClock
                    });

                    assert.same(sandbox.serverPrototype, fakeServerWithClock);
                });

                it("yields clock when faking timers", function() {
                    var sandbox = createSandbox(
                        sinonConfig({
                            injectIntoThis: false,
                            properties: ["server", "clock"]
                        })
                    );

                    assert.same(sandbox.args[0], this.fakeServer);
                    assert.clock(sandbox.args[1]);

                    sandbox.restore();
                });

                it("injects properties into object", function() {
                    var object = {};

                    var sandbox = createSandbox(
                        sinonConfig({
                            properties: ["server", "clock"],
                            injectInto: object
                        })
                    );

                    assert.equals(sandbox.args.length, 0);
                    assert.equals(object.server, this.fakeServer);
                    assert.clock(object.clock);
                    refute.defined(object.spy);
                    refute.defined(object.stub);
                    refute.defined(object.mock);
                    refute.defined(object.requests);

                    sandbox.restore();
                });

                it("should inject server and clock when only enabling them", function() {
                    var object = {};

                    var sandbox = createSandbox(
                        sinonConfig({
                            injectInto: object,
                            useFakeTimers: true,
                            useFakeServer: true
                        })
                    );

                    assert.equals(sandbox.args.length, 0);
                    assert.equals(object.server, this.fakeServer);
                    assert.clock(object.clock);
                    assert.isFunction(object.spy);
                    assert.isFunction(object.stub);
                    assert.isFunction(object.mock);
                    assert.isArray(object.requests);
                    refute.defined(object.sandbox);

                    sandbox.restore();
                });
            });
        }

        // This is currently testing the internals of useFakeTimers, we could possibly change it to be based on
        // behavior.
        it("fakes specified timers", function() {
            var sandbox = createSandbox(
                sinonConfig({
                    injectIntoThis: false,
                    properties: ["clock"],
                    useFakeTimers: { toFake: ["Date", "setTimeout"] }
                })
            );

            assert(this.useFakeTimersSpy.calledWith({ toFake: ["Date", "setTimeout"] }));

            sandbox.restore();
        });

        it("injects sandbox", function() {
            var object = {};

            var sandbox = createSandbox(
                sinonConfig({
                    properties: ["sandbox", "spy"],
                    injectInto: object
                })
            );

            assert.equals(sandbox.args.length, 0);
            assert.isFunction(object.spy);
            assert.isObject(object.sandbox);

            sandbox.restore();
        });

        it("injects match", function() {
            var object = {};

            var sandbox = createSandbox(
                sinonConfig({
                    properties: ["match"],
                    injectInto: object
                })
            );

            assert.same(object.match, match);

            sandbox.restore();
        });
    });

    describe("getters and setters", function() {
        it("allows stubbing getters", function() {
            var object = {
                foo: "bar"
            };

            var sandbox = new Sandbox();
            sandbox.stub(object, "foo").get(function() {
                return "baz";
            });

            assert.equals(object.foo, "baz");
        });

        it("allows restoring getters", function() {
            var object = {
                foo: "bar"
            };

            var sandbox = new Sandbox();
            sandbox.stub(object, "foo").get(function() {
                return "baz";
            });

            sandbox.restore();

            assert.equals(object.foo, "bar");
        });

        it("allows stubbing setters", function() {
            var object = {
                foo: undefined,
                prop: "bar"
            };

            var sandbox = new Sandbox();
            sandbox.stub(object, "foo").set(function(val) {
                object.prop = val + "bla";
            });

            object.foo = "bla";

            assert.equals(object.prop, "blabla");
        });

        it("allows restoring setters", function() {
            var object = {
                prop: "bar"
            };

            var sandbox = new Sandbox();
            sandbox.stub(object, "prop").set(function setterFn(val) {
                object.prop = val + "bla";
            });

            sandbox.restore();

            object.prop = "bla";

            assert.equals(object.prop, "bla");
        });
    });
});
