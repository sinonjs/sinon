"use strict";

var referee = require("referee");
var sinon = require("../lib/sinon");
var assert = referee.assert;

describe("sinon.collection", function () {
    it("creates fake collection", function () {
        var collection = sinon.create(sinon.collection);

        assert.isFunction(collection.verify);
        assert.isFunction(collection.restore);
        assert.isFunction(collection.verifyAndRestore);
        assert.isFunction(collection.stub);
        assert.isFunction(collection.mock);
    });

    describe(".stub", function () {
        beforeEach(function () {
            this.stub = sinon.stub;
            this.collection = sinon.create(sinon.collection);
        });

        afterEach(function () {
            sinon.stub = this.stub;
        });

        it("fails if stubbing property on null", function () {
            var error;

            try {
                this.collection.stub(null, "prop");
            } catch (e) {
                error = e;
            }

            assert.equals(error.message, "Trying to stub property 'prop' of null");
        });

        it("fails if stubbing symbol on null", function () {
            if (typeof Symbol === "function") {
                var error;

                try {
                    this.collection.stub(null, Symbol());
                } catch (e) {
                    error = e;
                }
                assert.equals(error.message, "Trying to stub property 'Symbol()' of null");
            }
        });

        it("calls stub", function () {
            var object = { method: function () {} };
            var args;

            sinon.stub = function () {
                args = Array.prototype.slice.call(arguments);
            };

            this.collection.stub(object, "method");

            assert.equals(args, [object, "method"]);
        });

        it("adds stub to fake array", function () {
            var object = { method: function () {} };

            sinon.stub = function () {
                return object;
            };

            this.collection.stub(object, "method");

            assert.equals(this.collection.fakes, [object]);
        });

        it("appends stubs to fake array", function () {
            var objects = [{ id: 42 }, { id: 17 }];
            var i = 0;

            sinon.stub = function () {
                return objects[i++];
            };

            this.collection.stub({ method: function () {} }, "method");
            this.collection.stub({ method: function () {} }, "method");

            assert.equals(this.collection.fakes, objects);
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

            sinon.stub = function () {
                return object;
            };

            this.collection.stub(object);

            assert.equals(this.collection.fakes, [object.method, object.method2, object.method3]);
            assert.equals(this.collection.fakes.length, 3);
        });

        it("returns a stubbed object", function () {
            var object = { method: function () {} };

            sinon.stub = function () {
                return object;
            };

            assert.equals(this.collection.stub(object), object);
        });

        it("returns a stubbed method", function () {
            var object = { method: function () {} };

            sinon.stub = function () {
                return object.method;
            };

            assert.equals(this.collection.stub(object, "method"), object.method);
        });

        if (typeof process !== "undefined") {
            describe("on node", function () {
                beforeEach(function () {
                    process.env.HELL = "Ain't too bad";
                });

                it("stubs environment property", function () {
                    this.collection.stub(process.env, "HELL", "froze over");
                    assert.equals(process.env.HELL, "froze over");
                });
            });
        }
    });

    describe("stub anything", function () {
        beforeEach(function () {
            this.object = { property: 42 };
            this.collection = sinon.create(sinon.collection);
        });

        it("stubs number property", function () {
            this.collection.stub(this.object, "property", 1);

            assert.equals(this.object.property, 1);
        });

        it("restores number property", function () {
            this.collection.stub(this.object, "property", 1);
            this.collection.restore();

            assert.equals(this.object.property, 42);
        });

        it("fails if property does not exist", function () {
            var collection = this.collection;
            var object = {};

            assert.exception(function () {
                collection.stub(object, "prop", 1);
            });
        });

        it("fails if Symbol does not exist", function () {
            if (typeof Symbol === "function") {
                var collection = this.collection;
                var object = {};

                assert.exception(function () {
                    collection.stub(object, Symbol(), 1);
                }, function (err) {
                    return err.message === "Cannot stub non-existent own property Symbol()";
                });
            }
        });
    });

    describe(".mock", function () {
        beforeEach(function () {
            this.mock = sinon.mock;
            this.collection = sinon.create(sinon.collection);
        });

        afterEach(function () {
            sinon.mock = this.mock;
        });

        it("calls mock", function () {
            var object = { id: 42 };
            var args;

            sinon.mock = function () {
                args = Array.prototype.slice.call(arguments);
            };

            this.collection.mock(object, "method");

            assert.equals(args, [object, "method"]);
        });

        it("adds mock to fake array", function () {
            var object = { id: 42 };

            sinon.mock = function () {
                return object;
            };

            this.collection.mock(object, "method");

            assert.equals(this.collection.fakes, [object]);
        });

        it("appends mocks to fake array", function () {
            var objects = [{ id: 42 }, { id: 17 }];
            var i = 0;

            sinon.mock = function () {
                return objects[i++];
            };

            this.collection.mock({}, "method");
            this.collection.mock({}, "method");

            assert.equals(this.collection.fakes, objects);
        });
    });

    describe("stub and mock test", function () {
        beforeEach(function () {
            this.mock = sinon.mock;
            this.stub = sinon.stub;
            this.collection = sinon.create(sinon.collection);
        });

        afterEach(function () {
            sinon.mock = this.mock;
            sinon.stub = this.stub;
        });

        it("appends mocks and stubs to fake array", function () {
            var objects = [{ id: 42 }, { id: 17 }];
            var i = 0;

            sinon.stub = sinon.mock = function () {
                return objects[i++];
            };

            this.collection.mock({ method: function () {} }, "method");
            this.collection.stub({ method: function () {} }, "method");

            assert.equals(this.collection.fakes, objects);
        });
    });

    describe(".verify", function () {
        beforeEach(function () {
            this.collection = sinon.create(sinon.collection);
        });

        it("calls verify on all fakes", function () {
            this.collection.fakes = [{
                verify: sinon.spy.create()
            }, {
                verify: sinon.spy.create()
            }];

            this.collection.verify();

            assert(this.collection.fakes[0].verify.called);
            assert(this.collection.fakes[1].verify.called);
        });
    });

    describe(".restore", function () {
        beforeEach(function () {
            this.collection = sinon.create(sinon.collection);
            this.collection.fakes = [{
                restore: sinon.spy.create()
            }, {
                restore: sinon.spy.create()
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
            this.collection = sinon.create(sinon.collection);
        });

        it("calls verify and restore", function () {
            this.collection.verify = sinon.spy.create();
            this.collection.restore = sinon.spy.create();

            this.collection.verifyAndRestore();

            assert(this.collection.verify.called);
            assert(this.collection.restore.called);
        });

        it("throws when restore throws", function () {
            this.collection.verify = sinon.spy.create();
            this.collection.restore = sinon.stub.create().throws();

            assert.exception(function () {
                this.collection.verifyAndRestore();
            });
        });

        it("calls restore when restore throws", function () {
            this.collection.verify = sinon.spy.create();
            this.collection.restore = sinon.stub.create().throws();

            try {
                this.collection.verifyAndRestore();
            }
            catch (e) {} // eslint-disable-line no-empty

            assert(this.collection.restore.called);
        });
    });

    describe(".reset", function () {
        beforeEach(function () {
            this.collection = sinon.create(sinon.collection);
            this.collection.fakes = [{
                reset: sinon.spy.create()
            }, {
                reset: sinon.spy.create()
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
            this.collection = sinon.create(sinon.collection);
            this.collection.fakes = [{
                resetBehavior: sinon.spy.create()
            }, {
                resetBehavior: sinon.spy.create()
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
            this.collection = sinon.create(sinon.collection);
            this.collection.fakes = [{
                resetHistory: sinon.spy.create()
            }, {
                resetHistory: sinon.spy.create()
            }];
        });

        it("calls resetHistory on all fakes", function () {
            var fake0 = this.collection.fakes[0];
            var fake1 = this.collection.fakes[1];

            this.collection.resetHistory();

            assert(fake0.resetHistory.called);
            assert(fake1.resetHistory.called);
        });
    });

    describe("inject test", function () {
        beforeEach(function () {
            this.collection = sinon.create(sinon.collection);
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
            sinon.stub(this.collection, "spy");
            sinon.stub(this.collection, "stub");
            sinon.stub(this.collection, "mock");

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
