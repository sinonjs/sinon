"use strict";

var referee = require("referee");
var sinonCollection = require("../lib/sinon/collection");
var sinonSpy = require("../lib/sinon/spy");
var sinonStub = require("../lib/sinon/stub");
var assert = referee.assert;
var refute = referee.refute;
var deprecated = require("../lib/sinon/util/core/deprecated");

describe("collection", function () {
    it("creates fake collection", function () {
        var collection = Object.create(sinonCollection);

        assert.isFunction(collection.verify);
        assert.isFunction(collection.restore);
        assert.isFunction(collection.verifyAndRestore);
        assert.isFunction(collection.stub);
        assert.isFunction(collection.mock);
    });

    describe(".createStubInstance", function () {
        beforeEach(function () {
            this.collection = Object.create(sinonCollection);
        });

        it("stubs existing methods", function () {
            var Class = function () {};
            Class.prototype.method = function () {};

            var stub = this.collection.createStubInstance(Class);
            stub.method.returns(3);
            assert.equals(3, stub.method());
        });

        it("resets all stub methods on reset()", function () {
            var Class = function () {};
            Class.prototype.method1 = function () {};
            Class.prototype.method2 = function () {};
            Class.prototype.method3 = function () {};

            var stub = this.collection.createStubInstance(Class);
            stub.method1.returns(1);
            stub.method2.returns(2);
            stub.method3.returns(3);

            assert.equals(3, stub.method3());

            this.collection.reset();
            assert.equals(undefined, stub.method1());
            assert.equals(undefined, stub.method2());
            assert.equals(undefined, stub.method3());
        });

        it("doesn't stub fake methods", function () {
            var Class = function () {};

            var stub = this.collection.createStubInstance(Class);
            assert.exception(function () {
                stub.method.returns(3);
            });
        });

        it("doesn't call the constructor", function () {
            var Class = function (a, b) {
                var c = a + b;
                throw c;
            };
            Class.prototype.method = function () {};

            var stub = this.collection.createStubInstance(Class);
            refute.exception(function () {
                stub.method(3);
            });
        });

        it("retains non function values", function () {
            var TYPE = "some-value";
            var Class = function () {};
            Class.prototype.type = TYPE;

            var stub = this.collection.createStubInstance(Class);
            assert.equals(TYPE, stub.type);
        });

        it("has no side effects on the prototype", function () {
            var proto = {
                method: function () {
                    throw "error";
                }
            };
            var Class = function () {};
            Class.prototype = proto;

            var stub = this.collection.createStubInstance(Class);
            refute.exception(stub.method);
            assert.exception(proto.method);
        });

        it("throws exception for non function params", function () {
            var types = [{}, 3, "hi!"];

            for (var i = 0; i < types.length; i++) {
                // yes, it's silly to create functions in a loop, it's also a test
                assert.exception(function () { // eslint-disable-line no-loop-func
                    this.collection.createStubInstance(types[i]);
                });
            }
        });
    });

    describe(".stub", function () {
        beforeEach(function () {
            this.collection = Object.create(sinonCollection);
        });

        it("fails if stubbing property on null", function () {
            var collection = this.collection;

            assert.exception(
                function () {
                    collection.stub(null, "prop");
                },
                {
                    message: "Trying to stub property 'prop' of null"
                }
            );
        });

        it("fails if stubbing symbol on null", function () {
            if (typeof Symbol === "function") {
                var collection = this.collection;

                assert.exception(
                    function () {
                        collection.stub(null, Symbol());
                    },
                    {
                        message: "Trying to stub property 'Symbol()' of null"
                    }
                );
            }
        });

        it("creates a stub", function () {
            var object = { method: function () {} };

            this.collection.stub(object, "method");

            assert.equals(typeof object.method.restore, "function");
        });

        it("adds stub to fake array", function () {
            var object = { method: function () {} };

            this.collection.stub(object, "method");

            assert.equals(this.collection.fakes, [object.method]);
        });

        it("appends stubs to fake array", function () {
            this.collection.stub({ method: function () {} }, "method");
            this.collection.stub({ method: function () {} }, "method");

            assert.equals(this.collection.fakes.length, 2);
        });

        it("adds all object methods to fake array", function () {
            var object = {
                method: function () {},
                method2: function () {},
                method3: function () {}
            };

            Object.defineProperty(object, "method3", {
                enumerable: false
            });

            this.collection.stub(object);

            assert.contains(this.collection.fakes, object.method);
            assert.contains(this.collection.fakes, object.method2);
            assert.contains(this.collection.fakes, object.method3);
            assert.equals(this.collection.fakes.length, 3);
        });

        it("returns a stubbed object", function () {
            var object = { method: function () {} };
            assert.equals(this.collection.stub(object), object);
        });

        it("returns a stubbed method", function () {
            var object = { method: function () {} };
            assert.equals(this.collection.stub(object, "method"), object.method);
        });

        if (typeof process !== "undefined") {
            describe("on node", function () {
                beforeEach(function () {
                    process.env.HELL = "Ain't too bad";
                });

                it("stubs environment property", function () {
                    var originalPrintWarning = deprecated.printWarning;
                    deprecated.printWarning = function () {};

                    this.collection.stub(process.env, "HELL").value("froze over");
                    assert.equals(process.env.HELL, "froze over");

                    deprecated.printWarning = originalPrintWarning;
                });
            });
        }
    });

    describe("stub anything", function () {
        beforeEach(function () {
            this.object = { property: 42 };
            this.collection = Object.create(sinonCollection);
        });

        it("stubs number property", function () {
            var originalPrintWarning = deprecated.printWarning;
            deprecated.printWarning = function () {};

            this.collection.stub(this.object, "property").value(1);

            assert.equals(this.object.property, 1);

            deprecated.printWarning = originalPrintWarning;
        });

        it("restores number property", function () {
            var originalPrintWarning = deprecated.printWarning;
            deprecated.printWarning = function () {};

            this.collection.stub(this.object, "property").value(1);
            this.collection.restore();

            assert.equals(this.object.property, 42);

            deprecated.printWarning = originalPrintWarning;
        });

        it("fails if property does not exist", function () {
            var originalPrintWarning = deprecated.printWarning;
            deprecated.printWarning = function () {};

            var collection = this.collection;
            var object = {};

            assert.exception(function () {
                collection.stub(object, "prop", 1);
            });

            deprecated.printWarning = originalPrintWarning;
        });

        it("fails if Symbol does not exist", function () {
            if (typeof Symbol === "function") {
                var collection = this.collection;
                var object = {};

                var originalPrintWarning = deprecated.printWarning;
                deprecated.printWarning = function () {};

                assert.exception(function () {
                    collection.stub(object, Symbol());
                }, {message: "Cannot stub non-existent own property Symbol()"}, TypeError);

                deprecated.printWarning = originalPrintWarning;
            }
        });
    });

    describe(".mock", function () {
        beforeEach(function () {
            this.collection = Object.create(sinonCollection);
        });

        it("returns a mock", function () {
            var object = { method: function () { }};

            var actual = this.collection.mock(object);
            actual.expects("method");

            assert.equals(typeof actual.verify, "function");
            assert.equals(typeof object.method.restore, "function");
        });

        it("adds mock to fake array", function () {
            var object = { method: function () { }};

            var expected = this.collection.mock(object);

            assert.equals(this.collection.fakes, [expected]);
        });

        it("appends mocks to fake array", function () {
            this.collection.mock({});
            this.collection.mock({});

            assert.equals(this.collection.fakes.length, 2);
        });
    });

    describe("stub and mock test", function () {
        beforeEach(function () {
            this.collection = Object.create(sinonCollection);
        });

        it("appends mocks and stubs to fake array", function () {
            this.collection.mock({ method: function () {} }, "method");
            this.collection.stub({ method: function () {} }, "method");

            assert.equals(this.collection.fakes.length, 2);
        });
    });

    describe(".verify", function () {
        beforeEach(function () {
            this.collection = Object.create(sinonCollection);
        });

        it("calls verify on all fakes", function () {
            this.collection.fakes = [{
                verify: sinonSpy()
            }, {
                verify: sinonSpy()
            }];

            this.collection.verify();

            assert(this.collection.fakes[0].verify.called);
            assert(this.collection.fakes[1].verify.called);
        });
    });

    describe(".restore", function () {
        beforeEach(function () {
            this.collection = Object.create(sinonCollection);
            this.collection.fakes = [{
                restore: sinonSpy()
            }, {
                restore: sinonSpy()
            }];
        });

        it("calls restore on all fakes", function () {
            var fake0 = this.collection.fakes[0];
            var fake1 = this.collection.fakes[1];

            this.collection.restore();

            assert(fake0.restore.called);
            assert(fake1.restore.called);
        });

        it("removes from collection when restored", function () {
            this.collection.restore();
            assert(this.collection.fakes.length === 0);
        });

        it("restores functions when stubbing entire object", function () {
            var a = function () {};
            var b = function () {};
            var obj = { a: a, b: b };
            this.collection.stub(obj);

            this.collection.restore();

            assert.same(obj.a, a);
            assert.same(obj.b, b);
        });
    });

    describe("verify and restore", function () {
        beforeEach(function () {
            this.collection = Object.create(sinonCollection);
        });

        it("calls verify and restore", function () {
            this.collection.verify = sinonSpy();
            this.collection.restore = sinonSpy();

            this.collection.verifyAndRestore();

            assert(this.collection.verify.called);
            assert(this.collection.restore.called);
        });

        it("throws when restore throws", function () {
            this.collection.verify = sinonSpy();
            this.collection.restore = sinonStub().throws();

            assert.exception(function () {
                this.collection.verifyAndRestore();
            });
        });

        it("calls restore when restore throws", function () {
            var collection = this.collection;

            collection.verify = sinonSpy();
            collection.restore = sinonStub().throws();

            assert.exception(function () {
                collection.verifyAndRestore();
            });

            assert(collection.restore.called);
        });
    });

    describe(".reset", function () {
        beforeEach(function () {
            this.collection = Object.create(sinonCollection);
            this.collection.fakes = [{
                reset: sinonSpy()
            }, {
                reset: sinonSpy()
            }];
        });

        it("calls reset on all fakes", function () {
            var fake0 = this.collection.fakes[0];
            var fake1 = this.collection.fakes[1];

            this.collection.reset();

            assert(fake0.reset.called);
            assert(fake1.reset.called);
        });
    });

    describe(".resetBehavior", function () {
        beforeEach(function () {
            this.collection = Object.create(sinonCollection);
            this.collection.fakes = [{
                resetBehavior: sinonSpy()
            }, {
                resetBehavior: sinonSpy()
            }];
        });

        it("calls resetBehavior on all fakes", function () {
            var fake0 = this.collection.fakes[0];
            var fake1 = this.collection.fakes[1];

            this.collection.resetBehavior();

            assert(fake0.resetBehavior.called);
            assert(fake1.resetBehavior.called);
        });
    });

    describe(".resetHistory", function () {
        beforeEach(function () {
            this.collection = Object.create(sinonCollection);
            this.collection.fakes = [{
                // this fake has a resetHistory method
                resetHistory: sinonSpy()
            }, {
                // this fake has a resetHistory method
                resetHistory: sinonSpy()
            }, {
                // this fake pretends to be a spy, which does not have resetHistory method
                // but has a reset method
                reset: sinonSpy()
            }];
        });

        it("resets the history on all fakes", function () {
            var fake0 = this.collection.fakes[0];
            var fake1 = this.collection.fakes[1];
            var fake2 = this.collection.fakes[2];

            this.collection.resetHistory();

            assert(fake0.resetHistory.called);
            assert(fake1.resetHistory.called);
            assert(fake2.reset.called);
        });
    });

    describe("inject test", function () {
        beforeEach(function () {
            this.collection = Object.create(sinonCollection);
        });

        it("injects fakes into object", function () {
            var obj = {};
            this.collection.inject(obj);

            assert.isFunction(obj.spy);
            assert.isFunction(obj.stub);
            assert.isFunction(obj.mock);
        });

        it("returns argument", function () {
            var obj = {};

            assert.same(this.collection.inject(obj), obj);
        });

        it("injects spy, stub, mock bound to collection", function () {
            var obj = {};
            this.collection.inject(obj);
            sinonStub(this.collection, "spy");
            sinonStub(this.collection, "stub");
            sinonStub(this.collection, "mock");

            obj.spy();
            var fn = obj.spy;
            fn();

            obj.stub();
            fn = obj.stub;
            fn();

            obj.mock();
            fn = obj.mock;
            fn();

            assert(this.collection.spy.calledTwice);
            assert(this.collection.stub.calledTwice);
            assert(this.collection.mock.calledTwice);
        });
    });
});
