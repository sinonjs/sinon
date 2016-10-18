"use strict";

var referee = require("referee");
var sinonStub = require("../lib/sinon/stub");
var sinonSpy = require("../lib/sinon/spy");
var sinonAssert = require("../lib/sinon/assert");
var sinonMatch = require("../lib/sinon/match");
var assert = referee.assert;
var refute = referee.refute;

describe("assert", function () {
    beforeEach(function () {
        this.global = typeof window !== "undefined" ? window : global;

        this.setUpStubs = function () {
            this.stub = sinonStub.create();
            sinonStub(sinonAssert, "fail").throws();
            sinonStub(sinonAssert, "pass");
        };

        this.tearDownStubs = function () {
            sinonAssert.fail.restore();
            sinonAssert.pass.restore();
        };
    });

    it("is object", function () {
        assert.isObject(sinonAssert);
    });

    it("supports proxy property", function () {
        var failed = false;
        var api = { method: function () {} };
        api.method.proxy = function () {};
        sinonSpy(api, "method");
        api.method();
        try {
            sinonAssert.calledOnce(api.method);
        } catch (e) {
            failed = true;
        }
        assert.isFalse(failed);
    });

    describe(".fail", function () {
        beforeEach(function () {
            this.exceptionName = sinonAssert.failException;
        });

        afterEach(function () {
            sinonAssert.failException = this.exceptionName;
        });

        it("throws exception", function () {
            var failed = false;
            var exception;

            try {
                sinonAssert.fail("Some message");
                failed = true;
            } catch (e) {
                exception = e;
            }

            assert.isFalse(failed);
            assert.equals(exception.name, "AssertError");
        });

        it("throws configured exception type", function () {
            sinonAssert.failException = "RetardError";

            assert.exception(function () {
                sinonAssert.fail("Some message");
            }, "RetardError");
        });
    });

    describe(".match", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when arguments to not match", function () {
            assert.exception(function () {
                sinonAssert.match("foo", "bar");
            });

            assert(sinonAssert.fail.calledOnce);
        });

        it("passes when argumens match", function () {
            sinonAssert.match("foo", "foo");
            assert(sinonAssert.pass.calledOnce);
        });
    });

    describe(".called", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when method does not exist", function () {
            assert.exception(function () {
                sinonAssert.called();
            });

            assert(sinonAssert.fail.called);
        });

        it("fails when method is not stub", function () {
            assert.exception(function () {
                sinonAssert.called(function () {});
            });

            assert(sinonAssert.fail.called);
        });

        it("fails when method was not called", function () {
            var stub = this.stub;

            assert.exception(function () {
                sinonAssert.called(stub);
            });

            assert(sinonAssert.fail.called);
        });

        it("fails when called with more than one argument", function () {
            var stub = this.stub;
            stub();

            assert.exception(function () {
                sinonAssert.called(stub, 1);
            });
        });

        it("does not fail when method was called", function () {
            var stub = this.stub;
            stub();

            refute.exception(function () {
                sinonAssert.called(stub);
            });

            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            var stub = this.stub;
            stub();

            refute.exception(function () {
                sinonAssert.called(stub);
            });

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("called"));
        });
    });

    describe(".notCalled", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when method does not exist", function () {
            assert.exception(function () {
                sinonAssert.notCalled();
            });

            assert(sinonAssert.fail.called);
        });

        it("fails when method is not stub", function () {
            assert.exception(function () {
                sinonAssert.notCalled(function () {});
            });

            assert(sinonAssert.fail.called);
        });

        it("fails when method was called", function () {
            var stub = this.stub;
            stub();

            assert.exception(function () {
                sinonAssert.notCalled(stub);
            });

            assert(sinonAssert.fail.called);
        });

        it("fails when called with more than one argument", function () {
            var stub = this.stub;

            assert.exception(function () {
                sinonAssert.notCalled(stub, 1);
            });
        });

        it("passes when method was not called", function () {
            var stub = this.stub;

            refute.exception(function () {
                sinonAssert.notCalled(stub);
            });

            assert.isFalse(sinonAssert.fail.called);
        });

        it("should call pass callback", function () {
            var stub = this.stub;
            sinonAssert.notCalled(stub);

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("notCalled"));
        });
    });

    describe(".calledOnce", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when method does not exist", function () {
            assert.exception(function () {
                sinonAssert.calledOnce();
            });

            assert(sinonAssert.fail.called);
        });

        it("fails when method is not stub", function () {
            assert.exception(function () {
                sinonAssert.calledOnce(function () {});
            });

            assert(sinonAssert.fail.called);
        });

        it("fails when method was not called", function () {
            var stub = this.stub;

            assert.exception(function () {
                sinonAssert.calledOnce(stub);
            });

            assert(sinonAssert.fail.called);
        });

        it("fails when called with more than one argument", function () {
            var stub = this.stub;
            stub();

            assert.exception(function () {
                sinonAssert.calledOnce(stub, 1);
            });
        });

        it("passes when method was called", function () {
            var stub = this.stub;
            stub();

            refute.exception(function () {
                sinonAssert.calledOnce(stub);
            });

            assert.isFalse(sinonAssert.fail.called);
        });

        it("fails when method was called more than once", function () {
            var stub = this.stub;
            stub();
            stub();

            assert.exception(function () {
                sinonAssert.calledOnce(stub);
            });

            assert(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            var stub = this.stub;
            stub();
            sinonAssert.calledOnce(stub);

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("calledOnce"));
        });
    });

    describe(".calledTwice", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails if called once", function () {
            var stub = this.stub;
            this.stub();

            assert.exception(function () {
                sinonAssert.calledTwice(stub);
            });
        });

        it("fails when called with more than one argument", function () {
            var stub = this.stub;
            this.stub();
            this.stub();

            assert.exception(function () {
                sinonAssert.calledTwice(stub, 1);
            });
        });

        it("passes if called twice", function () {
            var stub = this.stub;
            this.stub();
            this.stub();

            refute.exception(function () {
                sinonAssert.calledTwice(stub);
            });
        });

        it("calls pass callback", function () {
            var stub = this.stub;
            stub();
            stub();
            sinonAssert.calledTwice(stub);

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("calledTwice"));
        });
    });

    describe(".calledThrice", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails if called once", function () {
            var stub = this.stub;
            this.stub();

            assert.exception(function () {
                sinonAssert.calledThrice(stub);
            });
        });

        it("fails when called with more than one argument", function () {
            var stub = this.stub;
            this.stub();
            this.stub();
            this.stub();

            assert.exception(function () {
                sinonAssert.calledThrice(stub, 1);
            });
        });

        it("passes if called thrice", function () {
            var stub = this.stub;
            this.stub();
            this.stub();
            this.stub();

            refute.exception(function () {
                sinonAssert.calledThrice(stub);
            });
        });

        it("calls pass callback", function () {
            var stub = this.stub;
            stub();
            stub();
            stub();
            sinonAssert.calledThrice(stub);

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("calledThrice"));
        });
    });

    describe(".callOrder", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("passes when calls where done in right order", function () {
            var spy1 = sinonSpy();
            var spy2 = sinonSpy();
            spy1();
            spy2();

            refute.exception(function () {
                sinonAssert.callOrder(spy1, spy2);
            });
        });

        it("fails when calls where done in wrong order", function () {
            var spy1 = sinonSpy();
            var spy2 = sinonSpy();
            spy2();
            spy1();

            assert.exception(function () {
                sinonAssert.callOrder(spy1, spy2);
            });

            assert(sinonAssert.fail.called);
        });

        it("passes when many calls where done in right order", function () {
            var spy1 = sinonSpy();
            var spy2 = sinonSpy();
            var spy3 = sinonSpy();
            var spy4 = sinonSpy();
            spy1();
            spy2();
            spy3();
            spy4();

            refute.exception(function () {
                sinonAssert.callOrder(spy1, spy2, spy3, spy4);
            });
        });

        it("fails when one of many calls where done in wrong order", function () {
            var spy1 = sinonSpy();
            var spy2 = sinonSpy();
            var spy3 = sinonSpy();
            var spy4 = sinonSpy();
            spy1();
            spy2();
            spy4();
            spy3();

            assert.exception(function () {
                sinonAssert.callOrder(spy1, spy2, spy3, spy4);
            });

            assert(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            var stubs = [sinonSpy(), sinonSpy()];
            stubs[0]();
            stubs[1]();
            sinonAssert.callOrder(stubs[0], stubs[1]);

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("callOrder"));
        });

        it("passes for multiple calls to same spy", function () {
            var first = sinonSpy();
            var second = sinonSpy();

            first();
            second();
            first();

            refute.exception(function () {
                sinonAssert.callOrder(first, second, first);
            });
        });

        it("fails if first spy was not called", function () {
            var first = sinonSpy();
            var second = sinonSpy();

            second();

            assert.exception(function () {
                sinonAssert.callOrder(first, second);
            });
        });

        it("fails if second spy was not called", function () {
            var first = sinonSpy();
            var second = sinonSpy();

            first();

            assert.exception(function () {
                sinonAssert.callOrder(first, second);
            });
        });
    });

    describe(".calledOn", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when method does not exist", function () {
            var object = {};
            sinonStub(this.stub, "calledOn");

            assert.exception(function () {
                sinonAssert.calledOn(null, object);
            });

            assert.isFalse(this.stub.calledOn.calledWith(object));
            assert(sinonAssert.fail.called);
        });

        it("fails when method is not stub", function () {
            var object = {};
            sinonStub(this.stub, "calledOn");

            assert.exception(function () {
                sinonAssert.calledOn(function () {}, object);
            });

            assert.isFalse(this.stub.calledOn.calledWith(object));
            assert(sinonAssert.fail.called);
        });

        it("fails when method fails", function () {
            var object = {};
            sinonStub(this.stub, "calledOn").returns(false);
            var stub = this.stub;

            assert.exception(function () {
                sinonAssert.calledOn(stub, object);
            });

            assert(sinonAssert.fail.called);
        });

        it("passes when method doesn't fail", function () {
            var object = {};
            sinonStub(this.stub, "calledOn").returns(true);
            var stub = this.stub;

            sinonAssert.calledOn(stub, object);

            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            var obj = {};
            this.stub.call(obj);
            sinonAssert.calledOn(this.stub, obj);

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("calledOn"));
        });
    });

    describe(".calledWithNew", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when method does not exist", function () {
            sinonStub(this.stub, "calledWithNew");

            assert.exception(function () {
                sinonAssert.calledWithNew(null);
            });

            assert.isFalse(this.stub.calledWithNew.called);
            assert(sinonAssert.fail.called);
        });

        it("fails when method is not stub", function () {
            sinonStub(this.stub, "calledWithNew");

            assert.exception(function () {
                sinonAssert.calledWithNew(function () {});
            });

            assert.isFalse(this.stub.calledWithNew.called);
            assert(sinonAssert.fail.called);
        });

        it("fails when method fails", function () {
            sinonStub(this.stub, "calledWithNew").returns(false);
            var stub = this.stub;

            assert.exception(function () {
                sinonAssert.calledWithNew(stub);
            });

            assert(sinonAssert.fail.called);
        });

        it("passes when method doesn't fail", function () {
            sinonStub(this.stub, "calledWithNew").returns(true);
            var stub = this.stub;

            sinonAssert.calledWithNew(stub);

            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            new this.stub(); // eslint-disable-line no-new, new-cap
            sinonAssert.calledWithNew(this.stub);

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("calledWithNew"));
        });
    });

    describe(".alwaysCalledWithNew", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when method does not exist", function () {
            sinonStub(this.stub, "alwaysCalledWithNew");

            assert.exception(function () {
                sinonAssert.alwaysCalledWithNew(null);
            });

            assert.isFalse(this.stub.alwaysCalledWithNew.called);
            assert(sinonAssert.fail.called);
        });

        it("fails when method is not stub", function () {
            sinonStub(this.stub, "alwaysCalledWithNew");

            assert.exception(function () {
                sinonAssert.alwaysCalledWithNew(function () {});
            });

            assert.isFalse(this.stub.alwaysCalledWithNew.called);
            assert(sinonAssert.fail.called);
        });

        it("fails when method fails", function () {
            sinonStub(this.stub, "alwaysCalledWithNew").returns(false);
            var stub = this.stub;

            assert.exception(function () {
                sinonAssert.alwaysCalledWithNew(stub);
            });

            assert(sinonAssert.fail.called);
        });

        it("passes when method doesn't fail", function () {
            sinonStub(this.stub, "alwaysCalledWithNew").returns(true);
            var stub = this.stub;

            sinonAssert.alwaysCalledWithNew(stub);

            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            new this.stub(); // eslint-disable-line no-new, new-cap
            sinonAssert.alwaysCalledWithNew(this.stub);

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("alwaysCalledWithNew"));
        });
    });

    describe(".calledWith", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when method fails", function () {
            var object = {};
            sinonStub(this.stub, "calledWith").returns(false);
            var stub = this.stub;

            assert.exception(function () {
                sinonAssert.calledWith(stub, object, 1);
            });

            assert(this.stub.calledWith.calledWith(object, 1));
            assert(sinonAssert.fail.called);
        });

        it("passes when method doesn't fail", function () {
            var object = {};
            sinonStub(this.stub, "calledWith").returns(true);
            var stub = this.stub;

            refute.exception(function () {
                sinonAssert.calledWith(stub, object, 1);
            });

            assert(this.stub.calledWith.calledWith(object, 1));
            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            this.stub("yeah");
            sinonAssert.calledWith(this.stub, "yeah");

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("calledWith"));
        });

        it("works with spyCall", function () {
            var spy = sinonSpy();
            var object = {};
            spy();
            spy(object);

            sinonAssert.calledWith(spy.lastCall, object);
            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("calledWith"));
        });

        it("fails when spyCall failed", function () {
            var spy = sinonSpy();
            var object = {};
            spy();
            spy(object);

            assert.exception(function () {
                sinonAssert.calledWith(spy.lastCall, 1);
            });

            assert(sinonAssert.fail.called);
        });
    });

    describe(".calledWithExactly", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when method fails", function () {
            var object = {};
            sinonStub(this.stub, "calledWithExactly").returns(false);
            var stub = this.stub;

            assert.exception(function () {
                sinonAssert.calledWithExactly(stub, object, 1);
            });

            assert(this.stub.calledWithExactly.calledWithExactly(object, 1));
            assert(sinonAssert.fail.called);
        });

        it("passes when method doesn't fail", function () {
            var object = {};
            sinonStub(this.stub, "calledWithExactly").returns(true);
            var stub = this.stub;

            refute.exception(function () {
                sinonAssert.calledWithExactly(stub, object, 1);
            });

            assert(this.stub.calledWithExactly.calledWithExactly(object, 1));
            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            this.stub("yeah");
            sinonAssert.calledWithExactly(this.stub, "yeah");

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("calledWithExactly"));
        });
    });

    describe(".neverCalledWith", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when method fails", function () {
            var object = {};
            sinonStub(this.stub, "neverCalledWith").returns(false);
            var stub = this.stub;

            assert.exception(function () {
                sinonAssert.neverCalledWith(stub, object, 1);
            });

            assert(this.stub.neverCalledWith.calledWith(object, 1));
            assert(sinonAssert.fail.called);
        });

        it("passes when method doesn't fail", function () {
            var object = {};
            sinonStub(this.stub, "neverCalledWith").returns(true);
            var stub = this.stub;

            refute.exception(function () {
                sinonAssert.neverCalledWith(stub, object, 1);
            });

            assert(this.stub.neverCalledWith.calledWith(object, 1));
            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            this.stub("yeah");
            sinonAssert.neverCalledWith(this.stub, "nah!");

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("neverCalledWith"));
        });
    });

    describe(".threwTest", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when method fails", function () {
            sinonStub(this.stub, "threw").returns(false);
            var stub = this.stub;

            assert.exception(function () {
                sinonAssert.threw(stub, 1, 2);
            });

            assert(this.stub.threw.calledWithExactly(1, 2));
            assert(sinonAssert.fail.called);
        });

        it("passes when method doesn't fail", function () {
            sinonStub(this.stub, "threw").returns(true);
            var stub = this.stub;

            refute.exception(function () {
                sinonAssert.threw(stub, 1, 2);
            });

            assert(this.stub.threw.calledWithExactly(1, 2));
            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            sinonStub(this.stub, "threw").returns(true);
            this.stub();
            sinonAssert.threw(this.stub);

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("threw"));
        });
    });

    describe(".callCount", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails when method fails", function () {
            this.stub();
            this.stub();
            var stub = this.stub;

            assert.exception(function () {
                sinonAssert.callCount(stub, 3);
            });

            assert(sinonAssert.fail.called);
        });

        it("passes when method doesn't fail", function () {
            var stub = this.stub;
            this.stub.callCount = 3;

            refute.exception(function () {
                sinonAssert.callCount(stub, 3);
            });

            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            this.stub();
            sinonAssert.callCount(this.stub, 1);

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("callCount"));
        });
    });

    describe(".alwaysCalledOn", function () {
        beforeEach(function () {
            this.setUpStubs();
        });
        afterEach(function () {
            this.tearDownStubs();
        });

        it("fails if method is missing", function () {
            assert.exception(function () {
                sinonAssert.alwaysCalledOn();
            });
        });

        it("fails if method is not fake", function () {
            assert.exception(function () {
                sinonAssert.alwaysCalledOn(function () {}, {});
            });
        });

        it("fails if stub returns false", function () {
            var stub = sinonStub();
            sinonStub(stub, "alwaysCalledOn").returns(false);

            assert.exception(function () {
                sinonAssert.alwaysCalledOn(stub, {});
            });

            assert(sinonAssert.fail.called);
        });

        it("passes if stub returns true", function () {
            var stub = sinonStub.create();
            sinonStub(stub, "alwaysCalledOn").returns(true);

            sinonAssert.alwaysCalledOn(stub, {});

            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            this.stub();
            sinonAssert.alwaysCalledOn(this.stub, this);

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("alwaysCalledOn"));
        });
    });

    describe(".alwaysCalledWith", function () {
        beforeEach(function () {
            sinonStub(sinonAssert, "fail").throws();
            sinonStub(sinonAssert, "pass");
        });

        afterEach(function () {
            sinonAssert.fail.restore();
            sinonAssert.pass.restore();
        });

        it("fails if method is missing", function () {
            assert.exception(function () {
                sinonAssert.alwaysCalledWith();
            });
        });

        it("fails if method is not fake", function () {
            assert.exception(function () {
                sinonAssert.alwaysCalledWith(function () {});
            });
        });

        it("fails if stub returns false", function () {
            var stub = sinonStub.create();
            sinonStub(stub, "alwaysCalledWith").returns(false);

            assert.exception(function () {
                sinonAssert.alwaysCalledWith(stub, {}, []);
            });

            assert(sinonAssert.fail.called);
        });

        it("passes if stub returns true", function () {
            var stub = sinonStub.create();
            sinonStub(stub, "alwaysCalledWith").returns(true);

            sinonAssert.alwaysCalledWith(stub, {}, []);

            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            var spy = sinonSpy();
            spy("Hello");
            sinonAssert.alwaysCalledWith(spy, "Hello");

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("alwaysCalledWith"));
        });
    });

    describe(".alwaysCalledWithExactly", function () {
        beforeEach(function () {
            sinonStub(sinonAssert, "fail");
            sinonStub(sinonAssert, "pass");
        });

        afterEach(function () {
            sinonAssert.fail.restore();
            sinonAssert.pass.restore();
        });

        it("fails if stub returns false", function () {
            var stub = sinonStub.create();
            sinonStub(stub, "alwaysCalledWithExactly").returns(false);

            sinonAssert.alwaysCalledWithExactly(stub, {}, []);

            assert(sinonAssert.fail.called);
        });

        it("passes if stub returns true", function () {
            var stub = sinonStub.create();
            sinonStub(stub, "alwaysCalledWithExactly").returns(true);

            sinonAssert.alwaysCalledWithExactly(stub, {}, []);

            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function () {
            var spy = sinonSpy();
            spy("Hello");
            sinonAssert.alwaysCalledWithExactly(spy, "Hello");

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("alwaysCalledWithExactly"));
        });
    });

    describe(".expose", function () {
        it("exposes asserts into object", function () {
            var test = {};
            sinonAssert.expose(test);

            assert.isFunction(test.fail);
            assert.isString(test.failException);
            assert.isFunction(test.assertCalled);
            assert.isFunction(test.assertCalledOn);
            assert.isFunction(test.assertCalledWith);
            assert.isFunction(test.assertCalledWithExactly);
            assert.isFunction(test.assertThrew);
            assert.isFunction(test.assertCallCount);
        });

        it("exposes asserts into global", function () {
            sinonAssert.expose(this.global, {
                includeFail: false
            });

            assert.equals(typeof failException, "undefined");
            /*eslint-disable no-undef*/
            assert.isFunction(assertCalled);
            assert.isFunction(assertCalledOn);
            assert.isFunction(assertCalledWith);
            assert.isFunction(assertCalledWithExactly);
            assert.isFunction(assertThrew);
            assert.isFunction(assertCallCount);
            /*eslint-enable no-undef*/
        });

        it("fails exposed asserts without errors", function () {
            sinonAssert.expose(this.global, {
                includeFail: false
            });

            try {
                assertCalled(sinonSpy()); // eslint-disable-line no-undef
            } catch (e) {
                assert.equals(e.message, "expected spy to have been called at least once but was never called");
            }
        });

        it("exposes asserts into object without prefixes", function () {
            var test = {};

            sinonAssert.expose(test, { prefix: "" });

            assert.isFunction(test.fail);
            assert.isString(test.failException);
            assert.isFunction(test.called);
            assert.isFunction(test.calledOn);
            assert.isFunction(test.calledWith);
            assert.isFunction(test.calledWithExactly);
            assert.isFunction(test.threw);
            assert.isFunction(test.callCount);
        });

        it("does not expose 'expose'", function () {
            var test = {};

            sinonAssert.expose(test, { prefix: "" });

            refute(test.expose, "Expose should not be exposed");
        });

        it("throws if target is undefined", function () {
            assert.exception(function () {
                sinonAssert.expose();
            }, "TypeError");
        });

        it("throws if target is null", function () {
            assert.exception(function () {
                sinonAssert.expose(null);
            }, "TypeError");
        });
    });

    describe("message", function () {
        beforeEach(function () {
            this.obj = {
                doSomething: function () {}
            };

            sinonSpy(this.obj, "doSomething");

            /*eslint consistent-return: "off"*/
            this.message = function (method) {
                try {
                    sinonAssert[method].apply(sinonAssert, [].slice.call(arguments, 1));
                } catch (e) {
                    return e.message;
                }
            };
        });

        it("assert.called exception message", function () {
            assert.equals(this.message("called", this.obj.doSomething),
                          "expected doSomething to have been called at " +
                          "least once but was never called");
        });

        it("assert.notCalled exception message one call", function () {
            this.obj.doSomething();

            assert.equals(this.message("notCalled", this.obj.doSomething).replace(/ at.*/g, ""),
                          "expected doSomething to not have been called " +
                          "but was called once\n    doSomething()");
        });

        it("assert.notCalled exception message four calls", function () {
            this.obj.doSomething();
            this.obj.doSomething();
            this.obj.doSomething();
            this.obj.doSomething();

            assert.equals(this.message("notCalled", this.obj.doSomething).replace(/ at.*/g, ""),
                          "expected doSomething to not have been called " +
                          "but was called 4 times\n    doSomething()\n    " +
                          "doSomething()\n    doSomething()\n    doSomething()");
        });

        it("assert.notCalled exception message with calls with arguments", function () {
            this.obj.doSomething();
            this.obj.doSomething(3);
            this.obj.doSomething(42, 1);
            this.obj.doSomething();

            assert.equals(this.message("notCalled", this.obj.doSomething).replace(/ at.*/g, ""),
                          "expected doSomething to not have been called " +
                          "but was called 4 times\n    doSomething()\n    " +
                          "doSomething(3)\n    doSomething(42, 1)\n    doSomething()");
        });

        it("assert.callOrder exception message", function () {
            var obj = { doop: function () {}, foo: function () {} };
            sinonSpy(obj, "doop");
            sinonSpy(obj, "foo");

            obj.doop();
            this.obj.doSomething();
            obj.foo();

            var message = this.message("callOrder", this.obj.doSomething, obj.doop, obj.foo);

            assert.equals(message,
                          "expected doSomething, doop, foo to be called in " +
                          "order but were called as doop, doSomething, foo");
        });

        it("assert.callOrder with missing first call exception message", function () {
            var obj = { doop: function () {}, foo: function () {} };
            sinonSpy(obj, "doop");
            sinonSpy(obj, "foo");

            obj.foo();

            var message = this.message("callOrder", obj.doop, obj.foo);

            assert.equals(message,
                          "expected doop, foo to be called in " +
                          "order but were called as foo");
        });

        it("assert.callOrder with missing last call exception message", function () {
            var obj = { doop: function () {}, foo: function () {} };
            sinonSpy(obj, "doop");
            sinonSpy(obj, "foo");

            obj.doop();

            var message = this.message("callOrder", obj.doop, obj.foo);

            assert.equals(message,
                          "expected doop, foo to be called in " +
                          "order but were called as doop");
        });

        it("assert.callCount exception message", function () {
            this.obj.doSomething();

            assert.equals(this.message("callCount", this.obj.doSomething, 3).replace(/ at.*/g, ""),
                          "expected doSomething to be called thrice but was called " +
                          "once\n    doSomething()");
        });

        it("assert.calledOnce exception message", function () {
            this.obj.doSomething();
            this.obj.doSomething();

            assert.equals(this.message("calledOnce", this.obj.doSomething).replace(/ at.*/g, ""),
                          "expected doSomething to be called once but was called " +
                          "twice\n    doSomething()\n    doSomething()");

            this.obj.doSomething();

            assert.equals(this.message("calledOnce", this.obj.doSomething).replace(/ at.*/g, ""),
                          "expected doSomething to be called once but was called " +
                          "thrice\n    doSomething()\n    doSomething()\n    doSomething()");
        });

        it("assert.calledTwice exception message", function () {
            this.obj.doSomething();

            assert.equals(this.message("calledTwice", this.obj.doSomething).replace(/ at.*/g, ""),
                          "expected doSomething to be called twice but was called " +
                          "once\n    doSomething()");
        });

        it("assert.calledThrice exception message", function () {
            this.obj.doSomething();
            this.obj.doSomething();
            this.obj.doSomething();
            this.obj.doSomething();

            assert.equals(
                this.message("calledThrice", this.obj.doSomething).replace(/ at.*/g, ""),
                "expected doSomething to be called thrice but was called 4 times\n" +
                    "    doSomething()\n    doSomething()\n    doSomething()\n    doSomething()"
            );
        });

        it("assert.calledOn exception message", function () {
            this.obj.toString = function () {
                return "[Oh yeah]";
            };

            var obj = {
                toString: function () {
                    return "[Oh no]";
                }
            };
            var obj2 = {
                toString: function () {
                    return "[Oh well]";
                }
            };

            this.obj.doSomething.call(obj);
            this.obj.doSomething.call(obj2);

            assert.equals(
                this.message("calledOn", this.obj.doSomething, this.obj),
                "expected doSomething to be called with [Oh yeah] as this but was called with [Oh no], [Oh well]"
            );
        });

        it("assert.alwaysCalledOn exception message", function () {
            this.obj.toString = function () {
                return "[Oh yeah]";
            };

            var obj = {
                toString: function () {
                    return "[Oh no]";
                }
            };
            var obj2 = {
                toString: function () {
                    return "[Oh well]";
                }
            };

            this.obj.doSomething.call(obj);
            this.obj.doSomething.call(obj2);
            this.obj.doSomething();

            assert.equals(
                this.message("alwaysCalledOn", this.obj.doSomething, this.obj),
                "expected doSomething to always be called with [Oh yeah] as this but was called with " +
                    "[Oh no], [Oh well], [Oh yeah]"
            );
        });

        it("assert.calledWithNew exception message", function () {
            this.obj.doSomething();

            assert.equals(this.message("calledWithNew", this.obj.doSomething),
                          "expected doSomething to be called with new");
        });

        it("assert.alwaysCalledWithNew exception message", function () {
            new this.obj.doSomething(); // eslint-disable-line no-new, new-cap
            this.obj.doSomething();

            assert.equals(this.message("alwaysCalledWithNew", this.obj.doSomething),
                          "expected doSomething to always be called with new");
        });

        it("assert.calledWith exception message", function () {
            this.obj.doSomething(1, 3, "hey");

            assert.equals(this.message("calledWith", this.obj.doSomething, 4, 3, "hey").replace(/ at.*/g, ""),
                          "expected doSomething to be called with arguments 4, 3, " +
                          "hey\n    doSomething(1, 3, hey)");
        });

        it("assert.calledWith match.any exception message", function () {
            this.obj.doSomething(true, true);

            assert.equals(
                this.message("calledWith", this.obj.doSomething, sinonMatch.any, false).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments any, false\n    doSomething(true, true)"
            );
        });

        it("assert.calledWith match.defined exception message", function () {
            this.obj.doSomething();

            assert.equals(
                this.message("calledWith", this.obj.doSomething, sinonMatch.defined).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments defined\n    doSomething()"
            );
        });

        it("assert.calledWith match.truthy exception message", function () {
            this.obj.doSomething();

            assert.equals(
                this.message("calledWith", this.obj.doSomething, sinonMatch.truthy).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments truthy\n    doSomething()"
            );
        });

        it("assert.calledWith match.falsy exception message", function () {
            this.obj.doSomething(true);

            assert.equals(this.message("calledWith", this.obj.doSomething, sinonMatch.falsy).replace(/ at.*/g, ""),
                          "expected doSomething to be called with arguments " +
                          "falsy\n    doSomething(true)");
        });

        it("assert.calledWith match.same exception message", function () {
            this.obj.doSomething();

            assert.equals(
                this.message("calledWith", this.obj.doSomething, sinonMatch.same(1)).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments same(1)\n    doSomething()"
            );
        });

        it("assert.calledWith match.typeOf exception message", function () {
            this.obj.doSomething();
            var matcher = sinonMatch.typeOf("string");

            assert.equals(
                this.message("calledWith", this.obj.doSomething, matcher).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments typeOf(\"string\")\n    doSomething()"
            );
        });

        it("assert.calledWith match.instanceOf exception message", function () {
            this.obj.doSomething();
            var matcher = sinonMatch.instanceOf(function CustomType() {});

            assert.equals(
                this.message("calledWith", this.obj.doSomething, matcher).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments instanceOf(CustomType)\n    doSomething()"
            );
        });

        it("assert.calledWith match object exception message", function () {
            this.obj.doSomething();
            var matcher = sinonMatch({ some: "value", and: 123 });

            assert.equals(
                this.message("calledWith", this.obj.doSomething, matcher).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments match(some: value, and: 123)\n    doSomething()"
            );
        });

        it("assert.calledWith match boolean exception message", function () {
            this.obj.doSomething();

            assert.equals(this.message("calledWith", this.obj.doSomething, sinonMatch(true)).replace(/ at.*/g, ""),
                          "expected doSomething to be called with arguments " +
                          "match(true)\n    doSomething()");
        });

        it("assert.calledWith match number exception message", function () {
            this.obj.doSomething();

            assert.equals(this.message("calledWith", this.obj.doSomething, sinonMatch(123)).replace(/ at.*/g, ""),
                          "expected doSomething to be called with arguments " +
                          "match(123)\n    doSomething()");
        });

        it("assert.calledWith match string exception message", function () {
            this.obj.doSomething();
            var matcher = sinonMatch("Sinon");

            assert.equals(this.message("calledWith", this.obj.doSomething, matcher).replace(/ at.*/g, ""),
                          "expected doSomething to be called with arguments " +
                          "match(\"Sinon\")\n    doSomething()");
        });

        it("assert.calledWith match regexp exception message", function () {
            this.obj.doSomething();

            assert.equals(
                this.message("calledWith", this.obj.doSomething, sinonMatch(/[a-z]+/)).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments match(/[a-z]+/)\n    doSomething()"
            );
        });

        it("assert.calledWith match test function exception message", function () {
            this.obj.doSomething();
            var matcher = sinonMatch({ test: function custom() {} });

            assert.equals(
                this.message("calledWith", this.obj.doSomething, matcher).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments match(custom)\n    doSomething()"
            );
        });

        it("assert.calledWithMatch exception message", function () {
            this.obj.doSomething(1, 3, "hey");

            assert.equals(this.message("calledWithMatch", this.obj.doSomething, 4, 3, "hey").replace(/ at.*/g, ""),
                          "expected doSomething to be called with match 4, 3, " +
                          "hey\n    doSomething(1, 3, hey)");
        });

        it("assert.alwaysCalledWith exception message", function () {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, "hey");

            assert.equals(this.message("alwaysCalledWith", this.obj.doSomething, 1, "hey").replace(/ at.*/g, ""),
                          "expected doSomething to always be called with arguments 1" +
                          ", hey\n    doSomething(1, 3, hey)\n    doSomething(1, hey)");
        });

        it("assert.alwaysCalledWithMatch exception message", function () {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, "hey");

            assert.equals(
                this.message("alwaysCalledWithMatch", this.obj.doSomething, 1, "hey").replace(/ at.*/g, ""),
                "expected doSomething to always be called with match 1" +
                    ", hey\n    doSomething(1, 3, hey)\n    doSomething(1, hey)"
            );
        });

        it("assert.calledWithExactly exception message", function () {
            this.obj.doSomething(1, 3, "hey");

            assert.equals(this.message("calledWithExactly", this.obj.doSomething, 1, 3).replace(/ at.*/g, ""),
                          "expected doSomething to be called with exact arguments 1" +
                          ", 3\n    doSomething(1, 3, hey)");
        });

        it("assert.alwaysCalledWithExactly exception message", function () {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, 3);

            assert.equals(this.message("alwaysCalledWithExactly", this.obj.doSomething, 1, 3).replace(/ at.*/g, ""),
                          "expected doSomething to always be called with exact " +
                          "arguments 1, 3\n    doSomething(1, 3, hey)\n    " +
                          "doSomething(1, 3)");
        });

        it("assert.neverCalledWith exception message", function () {
            this.obj.doSomething(1, 2, 3);

            assert.equals(this.message("neverCalledWith", this.obj.doSomething, 1, 2).replace(/ at.*/g, ""),
                          "expected doSomething to never be called with " +
                          "arguments 1, 2\n    doSomething(1, 2, 3)");
        });

        it("assert.neverCalledWithMatch exception message", function () {
            this.obj.doSomething(1, 2, 3);

            assert.equals(this.message("neverCalledWithMatch", this.obj.doSomething, 1, 2).replace(/ at.*/g, ""),
                          "expected doSomething to never be called with match " +
                          "1, 2\n    doSomething(1, 2, 3)");
        });

        it("assert.threw exception message", function () {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, 3);

            assert.equals(this.message("threw", this.obj.doSomething).replace(/ at.*/g, ""),
                          "doSomething did not throw exception\n" +
                          "    doSomething(1, 3, hey)\n    doSomething(1, 3)");
        });

        it("assert.alwaysThrew exception message", function () {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, 3);

            assert.equals(this.message("alwaysThrew", this.obj.doSomething).replace(/ at.*/g, ""),
                          "doSomething did not always throw exception\n" +
                          "    doSomething(1, 3, hey)\n    doSomething(1, 3)");
        });

        it("assert.match exception message", function () {
            assert.equals(this.message("match", { foo: 1 }, [1, 3]),
                          "expected value to match\n" +
                          "    expected = [1, 3]\n" +
                          "    actual = { foo: 1 }");
        });
    });
});
