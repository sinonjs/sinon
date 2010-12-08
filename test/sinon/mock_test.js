/*jslint onevar: false*/
/*globals testCase
          sinon
          fail
          assert
          assertFalse
          assertFunction
          assertObject
          assertSame
          assertNotSame
          assertEquals
          assertNoException
          assertException*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
(function () {
    testCase("MockCreateTest", {
        "should be function": function () {
            assertFunction(sinon.mock.create);
        },

        "should return object": function () {
            var mock = sinon.mock.create({});

            assertObject(mock);
        },

        "should return function with expects method": function () {
            var mock = sinon.mock.create({});

            assertFunction(mock.expects);
        },

        "should throw without object": function () {
            assertException(function () {
                sinon.mock.create();
            }, "TypeError");
        }
    });

    testCase("MockExpectsTest", {
        setUp: function () {
            this.mock = sinon.mock.create({ someMethod: function () {} });
        },

        "should throw without method": function () {
            var mock = this.mock;

            assertException(function () {
                mock.expects();
            }, "TypeError");
        },

        "should return expectation": function () {
            var result = this.mock.expects("someMethod");

            assertFunction(result);
            assertEquals("someMethod", result.method);
        },

        "should throw if expecting a non-existent method": function () {
            var mock = this.mock;

            assertException(function () {
                mock.expects("someMethod2");
            });
        }
    });

    testCase("ExpectationTest", {
        setUp: function () {
            this.method = "myMeth";
            this.expectation = sinon.expectation.create(this.methodName);
        },

        call: function () {
            this.expectation();

            assertFunction(this.expectation.invoke);
            assert(this.expectation.called);
        },

        "should be invokable": function () {
            var expectation = this.expectation;

            assertNoException(function () {
                expectation();
            });
        }
    });

    function expectationSetUp() {
        this.method = "myMeth";
        this.expectation = sinon.expectation.create(this.method);
    }

    function mockSetUp() {
        this.method = function () {};
        this.object = { method: this.method };
        this.mock = sinon.mock.create(this.object);
    }

    testCase("ExpectationReturnsTest", {
        setUp: expectationSetUp,

        "should return configured return value": function () {
            var object = {};
            this.expectation.returns(object);

            assertSame(object, this.expectation());
        }
    });

    testCase("ExpectationCallTest", {
        setUp: expectationSetUp,

        "should be called with correct this value": function () {
            var object = { method: this.expectation };
            object.method();

            assert(this.expectation.calledOn(object));
        }
    });

    testCase("ExpectationCallCountTest", {
        setUp: expectationSetUp,

        "should only be invokable once by default": function () {
            var expectation = this.expectation;
            expectation();

            assertException(function () {
                expectation();
            }, "ExpectationError");
        },

        "throw readable error": function () {
            var expectation = this.expectation;
            expectation();

            try {
                expectation();
                fail("Expected to throw");
            } catch (e) {
                assertEquals("myMeth already called once", e.message);
            }
        }
    });

    testCase("ExpectationCallCountNeverTest", {
        setUp: expectationSetUp,

        "should not be callable": function () {
            var expectation = this.expectation;
            expectation.never();

            assertException(function () {
                expectation();
            }, "ExpectationError");
        },

        "should return expectation for chaining": function () {
            assertSame(this.expectation, this.expectation.never());
        }
    });

    testCase("ExpectationCallCountOnceTest", {
        setUp: expectationSetUp,

        "should allow one call": function () {
            var expectation = this.expectation;
            expectation.once();
            expectation();

            assertException(function () {
                expectation();
            }, "ExpectationError");
        },

        "should return expectation for chaining": function () {
            assertSame(this.expectation, this.expectation.once());
        }
    });

    testCase("ExpectationCallCountTwiceTest", {
        setUp: expectationSetUp,

        "should allow two calls": function () {
            var expectation = this.expectation;
            expectation.twice();
            expectation();
            expectation();

            assertException(function () {
                expectation();
            }, "ExpectationError");
        },

        "should return expectation for chaining": function () {
            assertSame(this.expectation, this.expectation.twice());
        }
    });

    testCase("ExpectationCallCountThriceTest", {
        setUp: expectationSetUp,

        "should allow three calls": function () {
            var expectation = this.expectation;
            expectation.thrice();
            expectation();
            expectation();
            expectation();

            assertException(function () {
                expectation();
            }, "ExpectationError");
        },

        "should return expectation for chaining": function () {
            assertSame(this.expectation, this.expectation.thrice());
        }
    });

    testCase("ExpectationCallCountExactlyTest", {
        setUp: expectationSetUp,

        "should allow specified number of calls": function () {
            var expectation = this.expectation;
            expectation.exactly(2);
            expectation();
            expectation();

            assertException(function () {
                expectation();
            }, "ExpectationError");
        },

        "should return expectation for chaining": function () {
            assertSame(this.expectation, this.expectation.exactly(2));
        },

        "should throw without argument": function () {
            var expectation = this.expectation;

            assertException(function () {
                expectation.exactly();
            }, "TypeError");
        },

        "should throw without number": function () {
            var expectation = this.expectation;

            assertException(function () {
                expectation.exactly("12");
            }, "TypeError");
        }
    });

    testCase("MockExpectationAtLeastTest", {
        setUp: expectationSetUp,

        "should throw without argument": function () {
            var expectation = this.expectation;

            assertException(function () {
                expectation.atLeast();
            }, "TypeError");
        },

        "should throw without number": function () {
            var expectation = this.expectation;

            assertException(function () {
                expectation.atLeast({});
            }, "TypeError");
        },

        "should return expectation for chaining": function () {
            assertSame(this.expectation, this.expectation.atLeast(2));
        },

        "should allow any number of calls": function () {
            var expectation = this.expectation;
            expectation.atLeast(2);
            expectation();
            expectation();

            assertNoException(function () {
                expectation();
                expectation();
            });
        },

        "should not be met with too few calls": function () {
            this.expectation.atLeast(2);
            this.expectation();

            assertFalse(this.expectation.met());
        },

        "should be met with exact calls": function () {
            this.expectation.atLeast(2);
            this.expectation();
            this.expectation();

            assert(this.expectation.met());
        },

        "should be met with excessive calls": function () {
            this.expectation.atLeast(2);
            this.expectation();
            this.expectation();
            this.expectation();

            assert(this.expectation.met());
        }
    });

    testCase("MockExpectationAtMostTest", {
        setUp: expectationSetUp,

        "should throw without argument": function () {
            var expectation = this.expectation;

            assertException(function () {
                expectation.atMost();
            }, "TypeError");
        },

        "should throw without number": function () {
            var expectation = this.expectation;

            assertException(function () {
                expectation.atMost({});
            }, "TypeError");
        },

        "should return expectation for chaining": function () {
            assertSame(this.expectation, this.expectation.atMost(2));
        },

        "should allow fewer calls": function () {
            var expectation = this.expectation;
            expectation.atMost(2);

            assertNoException(function () {
                expectation();
            });
        },

        "should be met with fewer calls": function () {
            this.expectation.atMost(2);
            this.expectation();

            assert(this.expectation.met());
        },

        "should be met with exact calls": function () {
            this.expectation.atMost(2);
            this.expectation();
            this.expectation();

            assert(this.expectation.met());
        },

        "should not be met with excessive calls": function () {
            var expectation = this.expectation;
            this.expectation.atMost(2);
            this.expectation();
            this.expectation();

            assertException(function () {
                expectation();
            }, "ExpectationError");

            assertFalse(this.expectation.met());
        }
    });

    testCase("MockExpectationAtMostAndAtLeastTest", {
        setUp: function () {
            expectationSetUp.call(this);
            this.expectation.atLeast(2);
            this.expectation.atMost(3);
        },

        "should not be met with too few calls": function () {
            this.expectation();

            assertFalse(this.expectation.met());
        },

        "should be met with minimum calls": function () {
            this.expectation();
            this.expectation();

            assert(this.expectation.met());
        },

        "should be met with maximum calls": function () {
            this.expectation();
            this.expectation();
            this.expectation();

            assert(this.expectation.met());
        },

        "should throw with excessive calls": function () {
            var expectation = this.expectation;
            expectation();
            expectation();
            expectation();

            assertException(function () {
                expectation();
            }, "ExpectationError");
        }
    });

    testCase("MockExpectationMetTest", {
        setUp: expectationSetUp,

        "should not be met when not called enough times": function () {
            assertFalse(this.expectation.met());
        },

        "should be met when called enough times": function () {
            this.expectation();

            assert(this.expectation.met());
        },

        "should not be met when called too many times": function () {
            this.expectation();

            try {
                this.expectation();
            } catch (e) {}

            assertFalse(this.expectation.met());
        }
    });

    testCase("MockExpectationWithArgsTest", {
        setUp: expectationSetUp,

        "should be method": function () {
            assertFunction(this.expectation.withArgs);
        },

        "should return expectation for chaining": function () {
            assertSame(this.expectation, this.expectation.withArgs(1));
        },

        "should accept call with expected args": function () {
            this.expectation.withArgs(1, 2, 3);
            this.expectation(1, 2, 3);

            assert(this.expectation.met());
        },

        "should throw when called without args": function () {
            var expectation = this.expectation;
            expectation.withArgs(1, 2, 3);

            assertException(function () {
                expectation();
            }, "ExpectationError");
        },

        "should throw when called with too few args": function () {
            var expectation = this.expectation;
            expectation.withArgs(1, 2, 3);

            assertException(function () {
                expectation(1, 2);
            }, "ExpectationError");
        },

        "should throw when called with wrong args": function () {
            var expectation = this.expectation;
            expectation.withArgs(1, 2, 3);

            assertException(function () {
                expectation(2, 2, 3);
            }, "ExpectationError");
        },

        "should allow excessive args": function () {
            var expectation = this.expectation;
            expectation.withArgs(1, 2, 3);

            assertNoException(function () {
                expectation(1, 2, 3, 4);
            });
        }
    });

    testCase("MockExpectationWithExactArgsTest", {
        setUp: expectationSetUp,

        "should be method": function () {
            assertFunction(this.expectation.withExactArgs);
        },

        "should return expectation for chaining": function () {
            assertSame(this.expectation, this.expectation.withExactArgs(1));
        },

        "should accept call with expected args": function () {
            this.expectation.withExactArgs(1, 2, 3);
            this.expectation(1, 2, 3);

            assert(this.expectation.met());
        },

        "should throw when called without args": function () {
            var expectation = this.expectation;
            expectation.withExactArgs(1, 2, 3);

            assertException(function () {
                expectation();
            }, "ExpectationError");
        },

        "should throw when called with too few args": function () {
            var expectation = this.expectation;
            expectation.withExactArgs(1, 2, 3);

            assertException(function () {
                expectation(1, 2);
            }, "ExpectationError");
        },

        "should throw when called with wrong args": function () {
            var expectation = this.expectation;
            expectation.withExactArgs(1, 2, 3);

            assertException(function () {
                expectation(2, 2, 3);
            }, "ExpectationError");
        },

        "should not allow excessive args": function () {
            var expectation = this.expectation;
            expectation.withExactArgs(1, 2, 3);

            assertException(function () {
                expectation(1, 2, 3, 4);
            }, "ExpectationError");
        }
    });

    testCase("MockExpectationOnTest", {
        setUp: expectationSetUp,

        "should be method": function () {
            assertFunction(this.expectation.on);
        },

        "should return expectation for chaining": function () {
            assertSame(this.expectation, this.expectation.on({}));
        },

        "should allow calls on object": function () {
            this.expectation.on(this);
            this.expectation();

            assert(this.expectation.met());
        },

        "should throw if called on wrong object": function () {
            var expectation = this.expectation;
            expectation.on({});

            assertException(function () {
                expectation();
            }, "ExpectationError");
        }
    });

    testCase("MockExpectationVerifyTest", {
        setUp: expectationSetUp,

        "should throw if not called enough times": function () {
            var expectation = this.expectation;

            assertException(function () {
                expectation.verify();
            }, "ExpectationError");
        },

        "should throw readable error": function () {
            var expectation = this.expectation;

            try {
                expectation.verify();
                fail("Expected to throw");
            } catch (e) {
                assertEquals("myMeth expected to be called once, but was called 0 times", e.message);
            }
        }
    });

    testCase("MockVerifyTest", {
        setUp: mockSetUp,

        "should restore mocks": function () {
            this.object.method();
            this.object.method.call(this.thisValue);
            this.mock.verify();

            assertSame(this.method, this.object.method);
        },

        "should restore if not met": function () {
            var mock = this.mock;
            mock.expects("method");

            assertException(function () {
                mock.verify();
            }, "ExpectationError");

            assertSame(this.method, this.object.method);
        }
    });

    testCase("MockObjectTest", {
        setUp: mockSetUp,

        "should mock object method": function () {
            this.mock.expects("method");

            assertFunction(this.object.method);
            assertNotSame(this.method, this.object.method);
        },

        "should revert mocked method": function () {
            this.mock.expects("method");
            this.object.method.restore();

            assertSame(this.method, this.object.method);
        },

        "should revert expectation": function () {
            var method = this.mock.expects("method");
            this.object.method.restore();

            assertSame(this.method, this.object.method);
        },

        "should revert mock": function () {
            var method = this.mock.expects("method");
            this.mock.restore();

            assertSame(this.method, this.object.method);
        },

        "should verify mock": function () {
            var method = this.mock.expects("method");
            this.object.method();
            var mock = this.mock;

            assertNoException(function () {
                assert(mock.verify());
            });
        },

        "should verify mock with unmet expectations": function () {
            var method = this.mock.expects("method");
            var mock = this.mock;

            assertException(function () {
                assert(mock.verify());
            }, "ExpectationError");
        }
    });

    testCase("MockMethodMultipleTimesTest", {
        setUp: function () {
            this.thisValue = {};
            this.method = function () {};
            this.object = { method: this.method };
            this.mock = sinon.mock.create(this.object);
            this.mock1 = this.mock.expects("method");
            this.mock2 = this.mock.expects("method").on(this.thisValue);
        },

        "should queue expectations": function () {
            var object = this.object;

            assertNoException(function () {
                object.method();
            });
        },

        "should start on next expectation when first is met": function () {
            var object = this.object;
            object.method();

            assertException(function () {
                object.method();
            }, "ExpectationError");
        },

        "should fail on last expectation": function () {
            var object = this.object;
            object.method();
            object.method.call(this.thisValue);

            assertException(function () {
                object.method();
            }, "ExpectationError");
        }
    });

    testCase("MockFunctionTest", {
        "should return mock method": function () {
            var mock = sinon.mock();

            assertFunction(mock);
            assertFunction(mock.atLeast);
            assertFunction(mock.verify);
        },

        "should return mock object": function () {
            var mock = sinon.mock({});

            assertObject(mock);
            assertFunction(mock.expects);
            assertFunction(mock.verify);
        }
    });
}());
