/*jslint onevar: false, eqeqeq: false, plusplus: false*/
/*globals testCase
          sinon
          fail
          assert
          assertArray
          assertEquals
          assertSame
          assertNotSame
          assertFunction
          assertObject
          assertException
          assertNoException*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
"use strict";

if (typeof require == "function" && typeof testCase == "undefined") {
    var testCase = require("../test_case_shim");
    var sinon = require("../../lib/sinon");
}

(function () {
    testCase("CollectionCreateTest", {
        "should create fake collection": function () {
            var collection = sinon.create(sinon.collection);

            assertFunction(collection.verify);
            assertFunction(collection.restore);
            assertFunction(collection.verifyAndRestore);
            assertFunction(collection.stub);
            assertFunction(collection.mock);
        }
    });

    testCase("CollectionStubTest", {
        setUp: function () {
            this.stub = sinon.stub;
            this.collection = sinon.create(sinon.collection);
        },

        tearDown: function () {
            sinon.stub = this.stub;
        },

        "should call stub": function () {
            var object = { method: function () {} };
            var args;

            sinon.stub = function () {
                args = Array.prototype.slice.call(arguments);
            };

            this.collection.stub(object, "method");

            assertEquals([object, "method"], args);
        },

        "should add stub to fake array": function () {
            var object = { method: function () {} };

            sinon.stub = function () {
                return object;
            };

            this.collection.stub(object, "method");

            assertEquals([object], this.collection.fakes);
        },

        "should append stubs to fake array": function () {
            var objects = [{ id: 42 }, { id: 17 }];
            var i = 0;

            sinon.stub = function () {
                return objects[i++];
            };

            this.collection.stub({ method: function () {} }, "method");
            this.collection.stub({ method: function () {} }, "method");

            assertEquals(objects, this.collection.fakes);
        }
    });

    testCase("CollectionStubAnythingTest", {
        setUp: function () {
            this.object = { property: 42 };
            this.collection = sinon.create(sinon.collection);
        },

        "should stub number property": function () {
            this.collection.stub(this.object, "property", 1);

            assertEquals(1, this.object.property);
        },

        "should restore number property": function () {
            this.collection.stub(this.object, "property", 1);
            this.collection.restore();

            assertEquals(42, this.object.property);
        },

        "should fail if property does not exist": function () {
            var collection = this.collection;
            var object = {};

            assertException(function () {
                collection.stub(object, "prop", 1);
            });
        }
    });

    testCase("CollectionMockTest", {
        setUp: function () {
            this.mock = sinon.mock;
            this.collection = sinon.create(sinon.collection);
        },

        tearDown: function () {
            sinon.mock = this.mock;
        },

        "should call mock": function () {
            var object = { id: 42 };
            var args;

            sinon.mock = function () {
                args = Array.prototype.slice.call(arguments);
            };

            this.collection.mock(object, "method");

            assertEquals([object, "method"], args);
        },

        "should add mock to fake array": function () {
            var object = { id: 42 };

            sinon.mock = function () {
                return object;
            };

            this.collection.mock(object, "method");

            assertEquals([object], this.collection.fakes);
        },

        "should append mocks to fake array": function () {
            var objects = [{ id: 42 }, { id: 17 }];
            var i = 0;

            sinon.mock = function () {
                return objects[i++];
            };

            this.collection.mock({}, "method");
            this.collection.mock({}, "method");

            assertEquals(objects, this.collection.fakes);
        }
    });

    testCase("CollectionStubAndMockTest", {
        setUp: function () {
            this.mock = sinon.mock;
            this.stub = sinon.stub;
            this.collection = sinon.create(sinon.collection);
        },

        tearDown: function () {
            sinon.mock = this.mock;
            sinon.stub = this.stub;
        },

        "should append mocks and stubs to fake array": function () {
            var objects = [{ id: 42 }, { id: 17 }];
            var i = 0;

            sinon.stub = sinon.mock = function () {
                return objects[i++];
            };

            this.collection.mock({ method: function () {} }, "method");
            this.collection.stub({ method: function () {} }, "method");

            assertEquals(objects, this.collection.fakes);
        }
    });

    testCase("CollectionVerifyTest", {
        setUp: function () {
            this.collection = sinon.create(sinon.collection);
        },

        "should call verify on all fakes": function () {
            this.collection.fakes = [{
                verify: sinon.spy.create()
            }, {
                verify: sinon.spy.create()
            }];

            this.collection.verify();

            assert(this.collection.fakes[0].verify.called);
            assert(this.collection.fakes[1].verify.called);
        }
    });

    testCase("CollectionRestoreTest", {
        setUp: function () {
            this.collection = sinon.create(sinon.collection);
            this.collection.fakes = [{
                restore: sinon.spy.create()
            }, {
                restore: sinon.spy.create()
            }];
        },

        "should call restore on all fakes": function () {
            var fake0 = this.collection.fakes[0];
            var fake1 = this.collection.fakes[1];

            this.collection.restore();

            assert(fake0.restore.called);
            assert(fake1.restore.called);
        },

        "should remove from collection when restored": function () {
          this.collection.restore();
          assert(this.collection.fakes.length == 0);
        }
    });

    testCase("CollectionVerifyAndRestoreTest", {
        setUp: function () {
            this.collection = sinon.create(sinon.collection);
        },

        "should call verify and restore": function () {
            this.collection.verify = sinon.spy.create();
            this.collection.restore = sinon.spy.create();

            this.collection.verifyAndRestore();

            assert(this.collection.verify.called);
            assert(this.collection.restore.called);
        },

        "should throw when restore throws": function () {
            this.collection.verify = sinon.spy.create();
            this.collection.restore = sinon.stub.create().throws();

            assertException(function () {
                this.collection.verifyAndRestore();
            });
        },

        "should call restore when restore throws": function () {
            this.collection.verify = sinon.spy.create();
            this.collection.restore = sinon.stub.create().throws();

            try {
                this.collection.verifyAndRestore();
            } catch (e) {}

            assert(this.collection.restore.called);
        }
    });

    testCase("CollectionInjectTest", {
        setUp: function () {
            this.collection = sinon.create(sinon.collection);
        },

        "should inject fakes into object": function () {
            var obj = {};
            this.collection.inject(obj);

            assertFunction(obj.spy);
            assertFunction(obj.stub);
            assertFunction(obj.mock);
        },

        "should return argument": function () {
            var obj = {};

            assertSame(obj, this.collection.inject(obj));
        },

        "should inject spy, stub, mock bound to collection": sinon.test(function () {
            var obj = {};
            this.collection.inject(obj);
            this.stub(this.collection, "spy");
            this.stub(this.collection, "stub");
            this.stub(this.collection, "mock");

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
        })
    });
}());
