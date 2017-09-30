"use strict";

var referee = require("referee");
var sinon = require("../../lib/sinon");
var createStub = require("../../lib/sinon/stub");
var assert = referee.assert;
var refute = referee.refute;

describe("issues", function () {
    beforeEach(function () {
        this.sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        this.sandbox.restore();
    });

    it("#283", function () {
        function testSinonFakeTimersWith(interval, ticks) {
            var clock = sinon.useFakeTimers();

            var spy = sinon.spy();
            var id = setInterval(spy, interval);
            assert(!spy.calledOnce);
            clock.tick(ticks);
            assert(spy.callCount === Math.floor(ticks / interval));

            clearInterval(id);
            clock.restore();
        }

        testSinonFakeTimersWith(10, 101);
        testSinonFakeTimersWith(99, 101);
        testSinonFakeTimersWith(100, 200);
        testSinonFakeTimersWith(199, 200);
        testSinonFakeTimersWith(500, 1001);
        testSinonFakeTimersWith(1000, 1001);
    });

    describe("#458", function () {
        if (typeof require("fs").readFileSync !== "undefined") {
            describe("on node", function () {
                it("stub out fs.readFileSync", function () {
                    var fs = require("fs");
                    var testCase = this;

                    refute.exception(function () {
                        testCase.sandbox.stub(fs, "readFileSync");
                    });
                });
            });
        }
    });

    describe("#624", function () {
        // eslint-disable-next-line mocha/no-skipped-tests
        it.skip("useFakeTimers should be idempotent", function () {
            // Issue #624 shows that useFakeTimers is not idempotent when it comes to
            // using Date.now
            // This test verifies that it's working, at least for Date.now
            var clock;

            clock = sinon.useFakeTimers(new Date("2014-12-29").getTime());
            assert.equals(clock.now, Date.now());

            clock = sinon.useFakeTimers(new Date("2015-12-15").getTime());
            assert.equals(clock.now, Date.now());

            clock = sinon.useFakeTimers(new Date("2015-1-5").getTime());
            assert.equals(clock.now, Date.now());
        });
    });

    describe("#852 - createStubInstance on intherited constructors", function () {
        it("must not throw error", function () {
            var A = function () {};
            var B = function () {};

            B.prototype = Object.create(A.prototype);
            B.prototype.constructor = A;

            refute.exception(function () {
                sinon.createStubInstance(B);
            });
        });
    });

    describe("#852(2) - createStubInstance should on same constructor", function () {
        it("must be idempotent", function () {
            var A = function () {};
            refute.exception(function () {
                sinon.createStubInstance(A);
                sinon.createStubInstance(A);
            });
        });
    });

    describe("#950 - first execution of a spy as a method renames that spy", function () {
        function bob() {}

        // IE 11 does not support the function name property
        if (bob.name) {
            it("should not rename spies", function () {
                var expectedName = "proxy";
                var spy = sinon.spy(bob);

                assert.equals(spy.name, expectedName);

                var obj = { methodName: spy };
                assert.equals(spy.name, expectedName);

                spy();
                assert.equals(spy.name, expectedName);

                obj.methodName.call(null);
                assert.equals(spy.name, expectedName);

                obj.methodName();
                assert.equals(spy.name, expectedName);

                obj.otherProp = spy;
                obj.otherProp();
                assert.equals(spy.name, expectedName);
            });
        }
    });

    describe("#1026", function () {
        it("should stub `watch` method on any Object", function () {
            // makes sure that Object.prototype.watch is set back to its old value
            function restore(oldWatch) {
                if (oldWatch) {
                    Object.prototype.watch = oldWatch; // eslint-disable-line no-extend-native
                } else {
                    delete Object.prototype.watch;
                }
            }

            try { // eslint-disable-line no-restricted-syntax
                var oldWatch = Object.prototype.watch;

                if (typeof Object.prototype.watch !== "function") {
                    Object.prototype.watch = function rolex() {}; // eslint-disable-line no-extend-native
                }

                var stubbedObject = sinon.stub({
                    watch: function () {}
                });

                stubbedObject.watch();

                assert.isArray(stubbedObject.watch.args);
            } catch (error) {
                restore(oldWatch);
                throw error;
            }

            restore(oldWatch);
        });
    });

    describe("#1154", function () {
        it("Ensures different matchers will not be tested against each other", function () {
            var match = sinon.match;
            var stub = sinon.stub;
            var readFile = stub();

            function endsWith(str, suffix) {
                return str.indexOf(suffix) + suffix.length === str.length;
            }

            function suffixA(fileName) {
                return endsWith(fileName, "suffixa");
            }

            function suffixB(fileName) {
                return endsWith(fileName, "suffixb");
            }

            var argsA = match(suffixA);
            var argsB = match(suffixB);

            var firstFake = readFile
                .withArgs(argsA);

            var secondFake = readFile
                .withArgs(argsB);

            assert(firstFake !== secondFake);
        });
    });

    describe("#1372 - sandbox.resetHistory", function () {
        it("should reset spies", function () {
            var spy = this.sandbox.spy();

            spy();
            assert.equals(spy.callCount, 1);

            spy();
            assert.equals(spy.callCount, 2);

            this.sandbox.resetHistory();

            spy();
            assert.equals(spy.callCount, 1); // should not fail but fails
        });
    });

    describe("#1398", function () {
        it("Call order takes into account both calledBefore and callCount", function () {
            var s1 = sinon.spy();
            var s2 = sinon.spy();

            s1();
            s2();
            s1();

            assert.exception(function () {
                sinon.assert.callOrder(s2, s1, s2);
            });
        });
    });

    describe("#1474 - promise library should be propagated through fakes and behaviors", function () {

        var stub;

        function makeAssertions(fake, expected) {
            assert.isFunction(fake.then);
            assert.isFunction(fake.tap);

            assert.equals(fake.tap(), expected);
        }

        before(function () {
            if (!global.Promise) { this.skip(); }
        });

        beforeEach(function () {
            var promiseLib = {
                resolve: function (value) {
                    var promise = Promise.resolve(value);
                    promise.tap = function () {
                        return "tap " + value;
                    };

                    return promise;
                }
            };

            stub = sinon.stub().usingPromise(promiseLib);

            stub.resolves("resolved");
        });

        it("stub.onCall", function () {
            stub.onSecondCall().resolves("resolved again");

            makeAssertions(stub(), "tap resolved");
            makeAssertions(stub(), "tap resolved again");
        });

        it("stub.withArgs", function () {
            stub.withArgs(42).resolves("resolved again");
            stub.withArgs(true).resolves("okay");

            makeAssertions(stub(), "tap resolved");
            makeAssertions(stub(42), "tap resolved again");
            makeAssertions(stub(true), "tap okay");
        });
    });


    describe("#1456", function () {
        var sandbox;

        function throwsOnUnconfigurableProperty() {
            /* eslint-disable no-restricted-syntax */
            try {
                var preDescriptor = Object.getOwnPropertyDescriptor(window, "innerHeight"); //backup val
                Object.defineProperty(window, "innerHeight", { value: 10, configureable: true, writeable: true });
                Object.defineProperty(window, "innerHeight", preDescriptor); //restore
                return false;
            } catch (err) {
                return true;
            }
            /* eslint-enable no-restricted-syntax */
        }

        beforeEach(function () {
            if (typeof window === "undefined" || throwsOnUnconfigurableProperty()) { this.skip(); }

            sandbox = sinon.createSandbox();
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("stub window innerHeight", function () {
            sandbox.stub(window, "innerHeight").value(111);

            assert.equals(window.innerHeight, 111);
        });
    });

    describe("#1487 - withArgs() returnValue", function () {
        beforeEach(function () {
            this.stub = createStub().throws("Nothing set");
            this.stub.withArgs("arg").returns("return value");
            this.stub("arg");
        });

        it("sets correct firstCall.returnValue", function () {
            assert.equals(this.stub.withArgs("arg").firstCall.returnValue, "return value");
        });

        it("sets correct lastCall.returnValue", function () {
            assert.equals(this.stub.withArgs("arg").lastCall.returnValue, "return value");
        });
    });

    describe("#1512 - sandbox.stub(obj,protoMethod)", function () {
        var sandbox;

        beforeEach(function () {
            sandbox = sinon.createSandbox();
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("can stub methods on the prototype", function () {
            var proto = { someFunction: function () {} };
            var instance = Object.create(proto);

            var stub = sandbox.stub(instance, "someFunction");
            instance.someFunction();
            assert(stub.called);
        });
    });

    describe("#1521 - stubbing Array.prototype.filter", function () {
        var orgFilter;

        before(function () {
            orgFilter = Array.prototype.filter;
        });

        afterEach(function () {
            /* eslint-disable no-extend-native */
            Array.prototype.filter = orgFilter;
        });

        it("should be possible stub filter", function () {
            var stub = sinon.stub(Array.prototype, "filter");
            [1, 2, 3].filter(function () { return false; });
            assert(stub.calledOnce);
        });

    });

    describe("#1531 - some copied functions on root sinon module throw", function () {
        it("should create a fake server without throwing", function () {
            refute.exception(function () {
                sinon.createFakeServer();
            });
        });

        it("should create a fake server with clock without throwing", function () {
            refute.exception(function () {
                sinon.createFakeServerWithClock();
            });
        });
    });

    describe("#1442 - callThrough with a mock expectation", function () {
        it("should call original method", function () {
            var foo = {
                bar: function () { }
            };

            var mock = this.sandbox.mock(foo);
            mock.expects("bar").callThrough();

            foo.bar();

            mock.verify();
        });
    });
});
