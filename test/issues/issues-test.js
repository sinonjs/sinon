"use strict";

var referee = require("@sinonjs/referee");
var sinon = require("../../lib/sinon");
var createStub = require("../../lib/sinon/stub");
var assert = referee.assert;
var refute = referee.refute;
var globalContext = typeof global !== "undefined" ? global : window;
var globalXHR = globalContext.XMLHttpRequest;
var globalAXO = globalContext.ActiveXObject;

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
        describe("on node", function () {
            beforeEach(function () {
                if (typeof require("fs").readFileSync !== "function") {
                    this.skip();
                }
            });

            it("stub out fs.readFileSync", function () {
                var fs = require("fs");
                var testCase = this;

                refute.exception(function () {
                    testCase.sandbox.stub(fs, "readFileSync");
                });
            });
        });
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

    describe("#852 - createStubInstance on inherited constructors", function () {
        it("must not throw error", function () {
            var A = function () {
                return;
            };
            var B = function () {
                return;
            };

            B.prototype = Object.create(A.prototype);
            B.prototype.constructor = A;
            B.prototype.noop = function () {
                return;
            };

            refute.exception(function () {
                sinon.createStubInstance(B);
            });
        });
    });

    describe("#852(2) - createStubInstance should on same constructor", function () {
        it("must be idempotent", function () {
            var A = function () {
                return;
            };
            A.prototype.meth = function () {
                return;
            };

            refute.exception(function () {
                sinon.createStubInstance(A);
                sinon.createStubInstance(A);
            });
        });
    });

    describe("#950 - first execution of a spy as a method renames that spy", function () {
        function bob() {
            return;
        }

        before(function () {
            // IE 11 does not support the function name property
            if (!bob.name) {
                this.skip();
            }
        });

        it("should not rename spies", function () {
            var nameDescriptor = Object.getOwnPropertyDescriptor(bob, "name");
            var expectedName =
                nameDescriptor && nameDescriptor.configurable ? "bob" : "proxy";
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

            var oldWatch;

            // eslint-disable-next-line no-restricted-syntax
            try {
                oldWatch = Object.prototype.watch;

                if (typeof Object.prototype.watch !== "function") {
                    // eslint-disable-next-line no-extend-native
                    Object.prototype.watch = function rolex() {
                        return;
                    };
                }

                var stubbedObject = sinon.stub({
                    watch: function () {
                        return;
                    },
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

            var firstFake = readFile.withArgs(argsA);

            var secondFake = readFile.withArgs(argsB);

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
            if (typeof Promise === "undefined") {
                this.skip();
            }
        });

        beforeEach(function () {
            var promiseLib = {
                resolve: function (value) {
                    var promise = Promise.resolve(value);
                    promise.tap = function () {
                        return `tap ${value}`;
                    };

                    return promise;
                },
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
                var preDescriptor = Object.getOwnPropertyDescriptor(
                    window,
                    "innerHeight"
                ); //backup val
                Object.defineProperty(window, "innerHeight", {
                    value: 10,
                    configurable: true,
                    writeable: true,
                });
                Object.defineProperty(window, "innerHeight", preDescriptor); //restore
                return false;
            } catch (err) {
                return true;
            }
            /* eslint-enable no-restricted-syntax */
        }

        beforeEach(function () {
            if (
                typeof window === "undefined" ||
                throwsOnUnconfigurableProperty()
            ) {
                this.skip();
            }

            sandbox = sinon.createSandbox();
        });

        afterEach(function () {
            if (sandbox) {
                sandbox.restore();
            }
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
            assert.equals(
                this.stub.withArgs("arg").firstCall.returnValue,
                "return value"
            );
        });

        it("sets correct lastCall.returnValue", function () {
            assert.equals(
                this.stub.withArgs("arg").lastCall.returnValue,
                "return value"
            );
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
            var proto = {
                someFunction: function () {
                    return;
                },
            };
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
            [1, 2, 3].filter(function () {
                return false;
            });
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
                bar: function () {
                    return;
                },
            };

            var mock = this.sandbox.mock(foo);
            mock.expects("bar").callThrough();

            foo.bar();

            mock.verify();
        });
    });

    describe("#1648 - resetHistory ", function () {
        it("should reset property spies", function () {
            var obj = {
                func: function () {
                    return;
                },
                get prop() {
                    return 1;
                },
            };

            var sandbox = sinon.createSandbox();
            var spyFunc = sandbox.spy(obj, "func");
            var spyProp = sandbox.spy(obj, "prop", ["get"]);

            refute.isTrue(spyFunc.called);
            refute.isTrue(spyProp.get.called);

            obj.func();
            //eslint-disable-next-line no-unused-expressions
            obj.prop;

            assert.isTrue(spyFunc.called);
            assert.isTrue(spyProp.get.called);

            sandbox.resetHistory();

            refute.isTrue(spyFunc.called);
            refute.isTrue(spyProp.get.called);
        });
    });

    // this error was caused by overwriting methods with imported ones don't use the collection
    // and thus were not restorable
    describe("#1775 - sinon.restore", function () {
        it("should restore all stubs", function () {
            var myApi = {
                someMethod: function someMethod() {
                    // eslint-disable-next-line no-console
                    console.log("test method!");
                },
            };

            sinon.stub(myApi, "someMethod");
            sinon.restore();
            sinon.stub(myApi, "someMethod");
            // TypeError: Attempted to wrap someMethod which is already wrapped
        });

        it("should restore all spies", function () {
            var myApi = {
                someMethod: function someMethod() {
                    // eslint-disable-next-line no-console
                    console.log("test method!");
                },
            };

            sinon.spy(myApi, "someMethod");
            sinon.restore();
            sinon.spy(myApi, "someMethod");
            // TypeError: Attempted to wrap someMethod which is already wrapped
        });

        it("should restore all mocks", function () {
            var myApi = {
                someMethod: function someMethod() {
                    // eslint-disable-next-line no-console
                    console.log("test method!");
                },
            };

            sinon.mock(myApi);
            sinon.restore();
            sinon.mock(myApi);
            // TypeError: Attempted to wrap someMethod which is already wrapped
        });
    });

    describe("#1801 - sinon.restore spied fakeTimers", function () {
        it("should restore spied fake timers", function () {
            var originalSetTimeout = setTimeout;

            sinon.useFakeTimers();
            sinon.spy(globalContext, "setTimeout");

            sinon.restore();

            assert.same(
                originalSetTimeout,
                globalContext.setTimeout,
                "fakeTimers restored"
            );
        });
    });

    describe("#1840 - sinon.restore useFakeXMLHttpRequest", function () {
        it("should restore XMLHttpRequest and ActiveXObject", function () {
            sinon.useFakeXMLHttpRequest();
            sinon.restore();

            assert.same(globalContext.XMLHttpRequest, globalXHR);
            assert.same(globalContext.ActiveXObject, globalAXO);
        });
    });

    describe("#1709 - deepEqual fails on cyclic references", function () {
        it("should not blow up", function () {
            var spy = sinon.spy();

            var firstObj = {};
            firstObj.aKeyName = firstObj;

            var secondObj = {};
            secondObj.aKeyName = secondObj;

            spy(firstObj);

            sinon.assert.calledWith(spy, secondObj);
        });
    });

    describe("#1796 - cannot stub Array.prototype.sort", function () {
        it("it should not fail with RangeError", function () {
            var stub = sinon.stub(Array.prototype, "sort");

            refute.exception(function () {
                [1, 2, 3].sort();
            });

            stub.restore();
        });
    });

    describe("#1900 - calledWith returns false positive", function () {
        it("should return false when call args don't match", function () {
            var spy = sinon.spy();
            var dateOne = new Date("2018-07-01");
            var dateTwo = new Date("2018-07-31");

            spy(dateOne);

            var calledWith = spy.calledWith(dateTwo);
            assert.same(calledWith, false);
        });
    });

    describe("#1882", function () {
        it("should use constructor name when checking deepEquality", function () {
            function ClassWithoutProps() {
                return;
            }

            function AnotherClassWithoutProps() {
                return;
            }

            ClassWithoutProps.prototype.constructor = ClassWithoutProps;
            AnotherClassWithoutProps.prototype.constructor =
                AnotherClassWithoutProps;
            var arg1 = new ClassWithoutProps(); //arg1.constructor.name === ClassWithoutProps
            var arg2 = new AnotherClassWithoutProps(); //arg2.constructor.name === Object
            var stub = sinon.stub();
            stub.withArgs(arg1).returns(5);
            var result = stub(arg2);
            assert.same(result, undefined); //[ERR_ASSERTION]: 5 === undefined
        });
    });

    describe("#1887", function () {
        it("should not break stub behavior using multiple `match.any`", function () {
            var stub = sinon.stub();

            stub.withArgs(
                sinon.match.any,
                sinon.match.any,
                sinon.match("a")
            ).returns("a");
            stub.withArgs(
                sinon.match.any,
                sinon.match.any,
                sinon.match("b")
            ).returns("b");

            assert.equals(stub({}, [], "a"), "a");
            assert.equals(stub({}, [], "b"), "b");
        });
    });

    describe("#1986", function () {
        it("should not set `lastArg` to undefined when last argument is `false`", function () {
            var fake = sinon.fake();

            fake(99, false);

            assert.isFalse(fake.lastArg);
        });
    });

    describe("#1964", function () {
        it("should allow callThrough on a withArgs fake", function () {
            var calledThrough = false;
            var obj = {
                method: function () {
                    calledThrough = true;
                },
            };

            var baseStub = sinon.stub(obj, "method");
            baseStub.throws("Should always hit the withArgs fake");
            var argsStub = baseStub.withArgs("foo").callThrough();

            obj.method("foo");

            sinon.assert.calledOnce(argsStub);
            assert.isTrue(calledThrough);
        });
    });

    describe("#2016", function () {
        function Foo() {
            return;
        }

        // eslint-disable-next-line mocha/no-setup-in-describe
        Foo.prototype.testMethod = function () {
            return;
        };

        var sandbox;
        beforeEach(function () {
            sandbox = sinon.createStubInstance(Foo);
        });

        afterEach(function () {
            sinon.restore();
        });

        describe("called on individual stub method", function () {
            it("should clear 'called' status on stub", function () {
                sandbox.testMethod();
                assert.isTrue(sandbox.testMethod.called);

                sandbox.testMethod.resetHistory();
                assert.isFalse(sandbox.testMethod.called);
            });
        });

        describe("called on module", function () {
            it("should clear 'called' status on all stubs", function () {
                sandbox.testMethod();
                assert.isTrue(sandbox.testMethod.called);

                sinon.resetHistory();
                assert.isFalse(sandbox.testMethod.called);
            });
        });
    });

    describe("#2073 - sinon.createStubInstance()", function () {
        function Foo() {
            return;
        }

        // eslint-disable-next-line mocha/no-setup-in-describe
        Foo.prototype.testMethod = function () {
            return 1;
        };

        it("should override the method", function () {
            var thing = sinon.createStubInstance(Foo, {
                testMethod: sinon.stub().returns(2),
            });
            assert.equals(thing.testMethod(), 2);
        });

        it("should support calling without object binding", function () {
            var createStubInstance = sinon.createStubInstance;
            refute.exception(function () {
                createStubInstance(Foo);
            });
        });
    });

    describe("#2065", function () {
        it("should restore the state of lastArg on the stub when resetting the sandbox", function () {
            var sandbox = sinon.createSandbox();
            var fake = sandbox.fake();
            fake(1, 2, 3);
            assert.equals(fake.lastArg, 3);
            sandbox.reset();
            refute.equals(fake.lastArg, 3);
        });
    });

    describe("#2226 - props on prototype are not restored correctly", function () {
        function createObjectWithPropFromPrototype() {
            var proto = {};
            var obj = {};

            Object.setPrototypeOf(obj, proto);
            Object.defineProperty(proto, "test", { writable: true, value: 1 });
            return obj;
        }

        it("should restore fakes shadowing prototype props correctly", function () {
            var obj = createObjectWithPropFromPrototype();

            var originalPropertyDescriptor = Object.getOwnPropertyDescriptor(
                obj,
                "test"
            );

            sinon.replace(obj, "test", 2);
            var replacedPropertyDescriptor = Object.getOwnPropertyDescriptor(
                obj,
                "test"
            );

            sinon.restore();
            var restoredPropertyDescriptor = Object.getOwnPropertyDescriptor(
                obj,
                "test"
            );

            assert.isUndefined(originalPropertyDescriptor);
            refute.isUndefined(replacedPropertyDescriptor);
            assert.isUndefined(restoredPropertyDescriptor);
        });

        it("should restore stubs shadowing prototype props correctly", function () {
            var obj = createObjectWithPropFromPrototype();
            var originalPropertyDescriptor = Object.getOwnPropertyDescriptor(
                obj,
                "test"
            );

            sinon.stub(obj, "test").value(2);
            var replacedPropertyDescriptor = Object.getOwnPropertyDescriptor(
                obj,
                "test"
            );

            sinon.restore();
            var restoredPropertyDescriptor = Object.getOwnPropertyDescriptor(
                obj,
                "test"
            );

            assert.isUndefined(originalPropertyDescriptor);
            refute.isUndefined(replacedPropertyDescriptor);
            assert.isUndefined(restoredPropertyDescriptor);
        });
    });
});
