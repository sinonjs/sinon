"use strict";

var color = require("../lib/sinon/color");
var referee = require("@sinonjs/referee");
var sinonStub = require("../lib/sinon/stub");
var sinonSpy = require("../lib/sinon/spy");
var sinonAssert = require("../lib/sinon/assert");
var match = require("@sinonjs/samsam").createMatcher;
var assert = referee.assert;
var refute = referee.refute;

function requiresValidFake(method) {
    it("should fail with non-function fake", function() {
        assert.exception(function() {
            sinonAssert[method]({});
        });
    });
}

describe("assert", function() {
    beforeEach(function() {
        this.global = typeof window !== "undefined" ? window : global;

        this.setUpStubs = function() {
            this.stub = sinonStub.create();
            sinonStub(sinonAssert, "fail").throws();
            sinonStub(sinonAssert, "pass");
        };

        this.tearDownStubs = function() {
            sinonAssert.fail.restore();
            sinonAssert.pass.restore();
        };
    });

    it("is object", function() {
        assert.isObject(sinonAssert);
    });

    it("supports proxy property", function() {
        var api = {
            method: function() {
                return;
            }
        };
        api.method.proxy = function() {
            return;
        };
        sinonSpy(api, "method");
        api.method();

        refute.exception(function() {
            sinonAssert.calledOnce(api.method);
        });
    });

    describe(".fail", function() {
        beforeEach(function() {
            this.exceptionName = sinonAssert.failException;
        });

        afterEach(function() {
            sinonAssert.failException = this.exceptionName;
        });

        it("throws exception", function() {
            assert.exception(
                function() {
                    sinonAssert.fail("Some message");
                },
                {
                    name: "AssertError"
                }
            );
        });

        it("throws configured exception type", function() {
            sinonAssert.failException = "CustomError";

            assert.exception(
                function() {
                    sinonAssert.fail("Some message");
                },
                { name: "CustomError" }
            );
        });
    });

    describe("with stubs", function() {
        beforeEach(function() {
            this.setUpStubs();
        });

        afterEach(function() {
            this.tearDownStubs();
        });

        describe(".match", function() {
            it("fails when arguments to not match", function() {
                assert.exception(function() {
                    sinonAssert.match("foo", "bar");
                });

                assert(sinonAssert.fail.calledOnce);
            });

            it("passes when argumens match", function() {
                sinonAssert.match("foo", "foo");
                assert(sinonAssert.pass.calledOnce);
            });
        });

        describe(".called", function() {
            requiresValidFake("called");

            it("fails when method does not exist", function() {
                assert.exception(function() {
                    sinonAssert.called();
                });

                assert(sinonAssert.fail.called);
            });

            it("fails when method is not stub", function() {
                assert.exception(function() {
                    sinonAssert.called(function() {
                        return;
                    });
                });

                assert(sinonAssert.fail.called);
            });

            it("fails when method was not called", function() {
                var stub = this.stub;

                assert.exception(function() {
                    sinonAssert.called(stub);
                });

                assert(sinonAssert.fail.called);
            });

            it("fails when called with more than one argument", function() {
                var stub = this.stub;
                stub();

                assert.exception(function() {
                    sinonAssert.called(stub, 1);
                });
            });

            it("does not fail when method was called", function() {
                var stub = this.stub;
                stub();

                refute.exception(function() {
                    sinonAssert.called(stub);
                });

                assert.isFalse(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                var stub = this.stub;
                stub();

                refute.exception(function() {
                    sinonAssert.called(stub);
                });

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("called"));
            });
        });

        describe(".notCalled", function() {
            requiresValidFake("notCalled");

            it("fails when method does not exist", function() {
                assert.exception(function() {
                    sinonAssert.notCalled();
                });

                assert(sinonAssert.fail.called);
            });

            it("fails when method is not stub", function() {
                assert.exception(function() {
                    sinonAssert.notCalled(function() {
                        return;
                    });
                });

                assert(sinonAssert.fail.called);
            });

            it("fails when method was called", function() {
                var stub = this.stub;
                stub();

                assert.exception(function() {
                    sinonAssert.notCalled(stub);
                });

                assert(sinonAssert.fail.called);
            });

            it("fails when called with more than one argument", function() {
                var stub = this.stub;

                assert.exception(function() {
                    sinonAssert.notCalled(stub, 1);
                });
            });

            it("passes when method was not called", function() {
                var stub = this.stub;

                refute.exception(function() {
                    sinonAssert.notCalled(stub);
                });

                assert.isFalse(sinonAssert.fail.called);
            });

            it("should call pass callback", function() {
                var stub = this.stub;
                sinonAssert.notCalled(stub);

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("notCalled"));
            });
        });

        describe(".calledOnce", function() {
            requiresValidFake("calledOnce");

            it("fails when method does not exist", function() {
                assert.exception(function() {
                    sinonAssert.calledOnce();
                });

                assert(sinonAssert.fail.called);
            });

            it("fails when method is not stub", function() {
                assert.exception(function() {
                    sinonAssert.calledOnce(function() {
                        return;
                    });
                });

                assert(sinonAssert.fail.called);
            });

            it("fails when method was not called", function() {
                var stub = this.stub;

                assert.exception(function() {
                    sinonAssert.calledOnce(stub);
                });

                assert(sinonAssert.fail.called);
            });

            it("fails when called with more than one argument", function() {
                var stub = this.stub;
                stub();

                assert.exception(function() {
                    sinonAssert.calledOnce(stub, 1);
                });
            });

            it("passes when method was called", function() {
                var stub = this.stub;
                stub();

                refute.exception(function() {
                    sinonAssert.calledOnce(stub);
                });

                assert.isFalse(sinonAssert.fail.called);
            });

            it("fails when method was called more than once", function() {
                var stub = this.stub;
                stub();
                stub();

                assert.exception(function() {
                    sinonAssert.calledOnce(stub);
                });

                assert(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                var stub = this.stub;
                stub();
                sinonAssert.calledOnce(stub);

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("calledOnce"));
            });
        });

        describe(".calledTwice", function() {
            requiresValidFake("calledTwice");

            it("fails if called once", function() {
                var stub = this.stub;
                this.stub();

                assert.exception(function() {
                    sinonAssert.calledTwice(stub);
                });
            });

            it("fails when called with more than one argument", function() {
                var stub = this.stub;
                this.stub();
                this.stub();

                assert.exception(function() {
                    sinonAssert.calledTwice(stub, 1);
                });
            });

            it("passes if called twice", function() {
                var stub = this.stub;
                this.stub();
                this.stub();

                refute.exception(function() {
                    sinonAssert.calledTwice(stub);
                });
            });

            it("calls pass callback", function() {
                var stub = this.stub;
                stub();
                stub();
                sinonAssert.calledTwice(stub);

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("calledTwice"));
            });
        });

        describe(".calledThrice", function() {
            requiresValidFake("calledThrice");

            it("fails if called once", function() {
                var stub = this.stub;
                this.stub();

                assert.exception(function() {
                    sinonAssert.calledThrice(stub);
                });
            });

            it("fails when called with more than one argument", function() {
                var stub = this.stub;
                this.stub();
                this.stub();
                this.stub();

                assert.exception(function() {
                    sinonAssert.calledThrice(stub, 1);
                });
            });

            it("passes if called thrice", function() {
                var stub = this.stub;
                this.stub();
                this.stub();
                this.stub();

                refute.exception(function() {
                    sinonAssert.calledThrice(stub);
                });
            });

            it("calls pass callback", function() {
                var stub = this.stub;
                stub();
                stub();
                stub();
                sinonAssert.calledThrice(stub);

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("calledThrice"));
            });
        });

        describe(".callOrder", function() {
            it("passes when calls were done in right order", function() {
                var spy1 = sinonSpy();
                var spy2 = sinonSpy();
                spy1();
                spy2();

                refute.exception(function() {
                    sinonAssert.callOrder(spy1, spy2);
                });
            });

            it("fails when calls were done in wrong order", function() {
                var spy1 = sinonSpy();
                var spy2 = sinonSpy();
                spy2();
                spy1();

                assert.exception(function() {
                    sinonAssert.callOrder(spy1, spy2);
                });

                assert(sinonAssert.fail.called);
            });

            it("passes when many calls were done in right order", function() {
                var spy1 = sinonSpy();
                var spy2 = sinonSpy();
                var spy3 = sinonSpy();
                var spy4 = sinonSpy();
                spy1();
                spy2();
                spy3();
                spy4();

                refute.exception(function() {
                    sinonAssert.callOrder(spy1, spy2, spy3, spy4);
                });
            });

            it("fails when one of many calls were done in wrong order", function() {
                var spy1 = sinonSpy();
                var spy2 = sinonSpy();
                var spy3 = sinonSpy();
                var spy4 = sinonSpy();
                spy1();
                spy2();
                spy4();
                spy3();

                assert.exception(function() {
                    sinonAssert.callOrder(spy1, spy2, spy3, spy4);
                });

                assert(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                var stubs = [sinonSpy(), sinonSpy()];
                stubs[0]();
                stubs[1]();
                sinonAssert.callOrder(stubs[0], stubs[1]);

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("callOrder"));
            });

            it("passes for multiple calls to same spy", function() {
                var first = sinonSpy();
                var second = sinonSpy();

                first();
                second();
                first();

                refute.exception(function() {
                    sinonAssert.callOrder(first, second, first);
                });
            });

            it("fails if first spy was not called", function() {
                var first = sinonSpy();
                var second = sinonSpy();

                second();

                assert.exception(function() {
                    sinonAssert.callOrder(first, second);
                });
            });

            it("fails if second spy was not called", function() {
                var first = sinonSpy();
                var second = sinonSpy();

                first();

                assert.exception(function() {
                    sinonAssert.callOrder(first, second);
                });
            });
        });

        describe(".calledOn", function() {
            it("fails when method does not exist", function() {
                var object = {};
                sinonStub(this.stub, "calledOn");

                assert.exception(function() {
                    sinonAssert.calledOn(null, object);
                });

                assert.isFalse(this.stub.calledOn.calledWith(object));
                assert(sinonAssert.fail.called);
            });

            it("fails when method is not stub", function() {
                var object = {};
                sinonStub(this.stub, "calledOn");

                assert.exception(function() {
                    sinonAssert.calledOn(function() {
                        return;
                    }, object);
                });

                assert.isFalse(this.stub.calledOn.calledWith(object));
                assert(sinonAssert.fail.called);
            });

            it("fails when method fails", function() {
                var object = {};
                sinonStub(this.stub, "calledOn").returns(false);
                var stub = this.stub;

                assert.exception(function() {
                    sinonAssert.calledOn(stub, object);
                });

                assert(sinonAssert.fail.called);
            });

            it("passes when method doesn't fail", function() {
                var object = {};
                sinonStub(this.stub, "calledOn").returns(true);
                var stub = this.stub;

                sinonAssert.calledOn(stub, object);

                assert.isFalse(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                var obj = {};
                this.stub.call(obj);
                sinonAssert.calledOn(this.stub, obj);

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("calledOn"));
            });

            it("works with spyCall", function() {
                var spy = sinonSpy();
                var target = {};
                spy();
                spy.call(target);

                sinonAssert.calledOn(spy.lastCall, target);
                assert(sinonAssert.pass.calledOn);
                assert(sinonAssert.pass.calledWith("calledOn"));
            });

            it("fails when spyCall failed", function() {
                var spy = sinonSpy();
                var target = {};
                spy();
                spy.call(target);

                assert.exception(function() {
                    sinonAssert.calledOn(spy.lastCall, 1);
                });

                assert(sinonAssert.fail.called);
            });
        });

        describe(".calledWithNew", function() {
            requiresValidFake("calledWithNew");

            it("fails when method does not exist", function() {
                sinonStub(this.stub, "calledWithNew");

                assert.exception(function() {
                    sinonAssert.calledWithNew(null);
                });

                assert.isFalse(this.stub.calledWithNew.called);
                assert(sinonAssert.fail.called);
            });

            it("fails when method is not stub", function() {
                sinonStub(this.stub, "calledWithNew");

                assert.exception(function() {
                    sinonAssert.calledWithNew(function() {
                        return;
                    });
                });

                assert.isFalse(this.stub.calledWithNew.called);
                assert(sinonAssert.fail.called);
            });

            it("fails when method fails", function() {
                sinonStub(this.stub, "calledWithNew").returns(false);
                var stub = this.stub;

                assert.exception(function() {
                    sinonAssert.calledWithNew(stub);
                });

                assert(sinonAssert.fail.called);
            });

            it("passes when method doesn't fail", function() {
                sinonStub(this.stub, "calledWithNew").returns(true);
                var stub = this.stub;

                sinonAssert.calledWithNew(stub);

                assert.isFalse(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                new this.stub(); // eslint-disable-line no-new, new-cap
                sinonAssert.calledWithNew(this.stub);

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("calledWithNew"));
            });

            it("works with spyCall", function() {
                var spy = sinonSpy();
                spy();
                new spy(); // eslint-disable-line no-new, new-cap

                sinonAssert.calledWithNew(spy.lastCall);
                assert(sinonAssert.pass.calledWithNew);
                assert(sinonAssert.pass.calledWith("calledWithNew"));
            });

            it("fails when spyCall failed", function() {
                var spy = sinonSpy();
                spy();
                new spy(); // eslint-disable-line no-new, new-cap

                assert.exception(function() {
                    sinonAssert.calledWithNew(spy.firstCall);
                });

                assert(sinonAssert.fail.called);
            });
        });

        describe(".alwaysCalledWithNew", function() {
            requiresValidFake("alwaysCalledWithNew");

            it("fails when method does not exist", function() {
                sinonStub(this.stub, "alwaysCalledWithNew");

                assert.exception(function() {
                    sinonAssert.alwaysCalledWithNew(null);
                });

                assert.isFalse(this.stub.alwaysCalledWithNew.called);
                assert(sinonAssert.fail.called);
            });

            it("fails when method is not stub", function() {
                sinonStub(this.stub, "alwaysCalledWithNew");

                assert.exception(function() {
                    sinonAssert.alwaysCalledWithNew(function() {
                        return;
                    });
                });

                assert.isFalse(this.stub.alwaysCalledWithNew.called);
                assert(sinonAssert.fail.called);
            });

            it("fails when method fails", function() {
                sinonStub(this.stub, "alwaysCalledWithNew").returns(false);
                var stub = this.stub;

                assert.exception(function() {
                    sinonAssert.alwaysCalledWithNew(stub);
                });

                assert(sinonAssert.fail.called);
            });

            it("passes when method doesn't fail", function() {
                sinonStub(this.stub, "alwaysCalledWithNew").returns(true);
                var stub = this.stub;

                sinonAssert.alwaysCalledWithNew(stub);

                assert.isFalse(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                new this.stub(); // eslint-disable-line no-new, new-cap
                sinonAssert.alwaysCalledWithNew(this.stub);

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("alwaysCalledWithNew"));
            });
        });

        describe(".calledWith", function() {
            it("fails when method fails", function() {
                var object = {};
                sinonStub(this.stub, "calledWith").returns(false);
                var stub = this.stub;

                assert.exception(function() {
                    sinonAssert.calledWith(stub, object, 1);
                });

                assert(this.stub.calledWith.calledWith(object, 1));
                assert(sinonAssert.fail.called);
            });

            it("passes when method doesn't fail", function() {
                var object = {};
                sinonStub(this.stub, "calledWith").returns(true);
                var stub = this.stub;

                refute.exception(function() {
                    sinonAssert.calledWith(stub, object, 1);
                });

                assert(this.stub.calledWith.calledWith(object, 1));
                assert.isFalse(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                this.stub("yeah");
                sinonAssert.calledWith(this.stub, "yeah");

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("calledWith"));
            });

            it("works with spyCall", function() {
                var spy = sinonSpy();
                var object = {};
                spy();
                spy(object);

                sinonAssert.calledWith(spy.lastCall, object);
                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("calledWith"));
            });

            it("fails when spyCall failed", function() {
                var spy = sinonSpy();
                var object = {};
                spy();
                spy(object);

                assert.exception(function() {
                    sinonAssert.calledWith(spy.lastCall, 1);
                });

                assert(sinonAssert.fail.called);
            });
        });

        describe(".calledWithExactly", function() {
            it("fails when method fails", function() {
                var object = {};
                sinonStub(this.stub, "calledWithExactly").returns(false);
                var stub = this.stub;

                assert.exception(function() {
                    sinonAssert.calledWithExactly(stub, object, 1);
                });

                assert(this.stub.calledWithExactly.calledWithExactly(object, 1));
                assert(sinonAssert.fail.called);
            });

            it("passes when method doesn't fail", function() {
                var object = {};
                sinonStub(this.stub, "calledWithExactly").returns(true);
                var stub = this.stub;

                refute.exception(function() {
                    sinonAssert.calledWithExactly(stub, object, 1);
                });

                assert(this.stub.calledWithExactly.calledWithExactly(object, 1));
                assert.isFalse(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                this.stub("yeah");
                sinonAssert.calledWithExactly(this.stub, "yeah");

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("calledWithExactly"));
            });

            it("works with spyCall", function() {
                var spy = sinonSpy();
                var object = {};
                spy();
                spy(object);

                sinonAssert.calledWithExactly(spy.lastCall, object);
                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("calledWithExactly"));
            });

            it("fails when spyCall failed", function() {
                var spy = sinonSpy();
                var object = {};
                spy();
                spy(object);

                assert.exception(function() {
                    sinonAssert.calledWithExactly(spy.lastCall, 1);
                });

                assert(sinonAssert.fail.called);
            });
        });

        describe(".neverCalledWith", function() {
            it("fails when method fails", function() {
                var object = {};
                sinonStub(this.stub, "neverCalledWith").returns(false);
                var stub = this.stub;

                assert.exception(function() {
                    sinonAssert.neverCalledWith(stub, object, 1);
                });

                assert(this.stub.neverCalledWith.calledWith(object, 1));
                assert(sinonAssert.fail.called);
            });

            it("passes when method doesn't fail", function() {
                var object = {};
                sinonStub(this.stub, "neverCalledWith").returns(true);
                var stub = this.stub;

                refute.exception(function() {
                    sinonAssert.neverCalledWith(stub, object, 1);
                });

                assert(this.stub.neverCalledWith.calledWith(object, 1));
                assert.isFalse(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                this.stub("yeah");
                sinonAssert.neverCalledWith(this.stub, "nah!");

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("neverCalledWith"));
            });
        });

        describe(".threwTest", function() {
            it("fails when method fails", function() {
                sinonStub(this.stub, "threw").returns(false);
                var stub = this.stub;

                assert.exception(function() {
                    sinonAssert.threw(stub, 1, 2);
                });

                assert(this.stub.threw.calledWithExactly(1, 2));
                assert(sinonAssert.fail.called);
            });

            it("passes when method doesn't fail", function() {
                sinonStub(this.stub, "threw").returns(true);
                var stub = this.stub;

                refute.exception(function() {
                    sinonAssert.threw(stub, 1, 2);
                });

                assert(this.stub.threw.calledWithExactly(1, 2));
                assert.isFalse(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                sinonStub(this.stub, "threw").returns(true);
                this.stub();
                sinonAssert.threw(this.stub);

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("threw"));
            });

            it("works with spyCall", function() {
                var stub = sinonStub().throws("Error");
                assert.exception(function() {
                    stub();
                });

                sinonAssert.threw(stub.firstCall, "Error");
                assert(sinonAssert.pass.threw);
                assert(sinonAssert.pass.calledWith("threw"));
            });

            it("fails when spyCall failed", function() {
                var stub = sinonStub().returns("Error");
                stub();

                assert.exception(function() {
                    sinonAssert.threw(stub.firstCall, "Error");
                });

                assert(sinonAssert.fail.called);
            });
        });

        describe(".callCount", function() {
            requiresValidFake("callCount");

            it("fails when method fails", function() {
                this.stub();
                this.stub();
                var stub = this.stub;

                assert.exception(function() {
                    sinonAssert.callCount(stub, 3);
                });

                assert(sinonAssert.fail.called);
            });

            it("passes when method doesn't fail", function() {
                var stub = this.stub;
                this.stub.callCount = 3;

                refute.exception(function() {
                    sinonAssert.callCount(stub, 3);
                });

                assert.isFalse(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                this.stub();
                sinonAssert.callCount(this.stub, 1);

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("callCount"));
            });
        });

        describe(".alwaysCalledOn", function() {
            it("fails if method is missing", function() {
                assert.exception(function() {
                    sinonAssert.alwaysCalledOn();
                });
            });

            it("fails if method is not fake", function() {
                assert.exception(function() {
                    sinonAssert.alwaysCalledOn(function() {
                        return;
                    }, {});
                });
            });

            it("fails if stub returns false", function() {
                var stub = sinonStub();
                sinonStub(stub, "alwaysCalledOn").returns(false);

                assert.exception(function() {
                    sinonAssert.alwaysCalledOn(stub, {});
                });

                assert(sinonAssert.fail.called);
            });

            it("passes if stub returns true", function() {
                var stub = sinonStub.create();
                sinonStub(stub, "alwaysCalledOn").returns(true);

                sinonAssert.alwaysCalledOn(stub, {});

                assert.isFalse(sinonAssert.fail.called);
            });

            it("calls pass callback", function() {
                this.stub();
                sinonAssert.alwaysCalledOn(this.stub, this);

                assert(sinonAssert.pass.calledOnce);
                assert(sinonAssert.pass.calledWith("alwaysCalledOn"));
            });
        });
    });

    describe(".alwaysCalledWith", function() {
        beforeEach(function() {
            sinonStub(sinonAssert, "fail").throws();
            sinonStub(sinonAssert, "pass");
        });

        afterEach(function() {
            sinonAssert.fail.restore();
            sinonAssert.pass.restore();
        });

        it("fails if method is missing", function() {
            assert.exception(function() {
                sinonAssert.alwaysCalledWith();
            });
        });

        it("fails if method is not fake", function() {
            assert.exception(function() {
                sinonAssert.alwaysCalledWith(function() {
                    return;
                });
            });
        });

        it("fails if stub returns false", function() {
            var stub = sinonStub.create();
            sinonStub(stub, "alwaysCalledWith").returns(false);

            assert.exception(function() {
                sinonAssert.alwaysCalledWith(stub, {}, []);
            });

            assert(sinonAssert.fail.called);
        });

        it("passes if stub returns true", function() {
            var stub = sinonStub.create();
            sinonStub(stub, "alwaysCalledWith").returns(true);

            sinonAssert.alwaysCalledWith(stub, {}, []);

            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function() {
            var spy = sinonSpy();
            spy("Hello");
            sinonAssert.alwaysCalledWith(spy, "Hello");

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("alwaysCalledWith"));
        });
    });

    describe(".alwaysCalledWithExactly", function() {
        beforeEach(function() {
            sinonStub(sinonAssert, "fail");
            sinonStub(sinonAssert, "pass");
        });

        afterEach(function() {
            sinonAssert.fail.restore();
            sinonAssert.pass.restore();
        });

        it("fails if stub returns false", function() {
            var stub = sinonStub.create();
            sinonStub(stub, "alwaysCalledWithExactly").returns(false);

            sinonAssert.alwaysCalledWithExactly(stub, {}, []);

            assert(sinonAssert.fail.called);
        });

        it("passes if stub returns true", function() {
            var stub = sinonStub.create();
            sinonStub(stub, "alwaysCalledWithExactly").returns(true);

            sinonAssert.alwaysCalledWithExactly(stub, {}, []);

            assert.isFalse(sinonAssert.fail.called);
        });

        it("calls pass callback", function() {
            var spy = sinonSpy();
            spy("Hello");
            sinonAssert.alwaysCalledWithExactly(spy, "Hello");

            assert(sinonAssert.pass.calledOnce);
            assert(sinonAssert.pass.calledWith("alwaysCalledWithExactly"));
        });
    });

    describe(".expose", function() {
        it("exposes asserts into object", function() {
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

        it("exposes asserts into global", function() {
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

        it("fails exposed asserts without errors", function() {
            sinonAssert.expose(this.global, {
                includeFail: false
            });

            assert.exception(
                function() {
                    assertCalled(sinonSpy()); // eslint-disable-line no-undef
                },
                {
                    message: "expected spy to have been called at least once but was never called"
                }
            );
        });

        it("exposes asserts into object without prefixes", function() {
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

        it("does not expose 'expose'", function() {
            var test = {};

            sinonAssert.expose(test, { prefix: "" });

            refute(test.expose, "Expose should not be exposed");
        });

        it("throws if target is undefined", function() {
            assert.exception(
                function() {
                    sinonAssert.expose();
                },
                { name: "TypeError" }
            );
        });

        it("throws if target is null", function() {
            assert.exception(
                function() {
                    sinonAssert.expose(null);
                },
                { name: "TypeError" }
            );
        });
    });

    describe("message", function() {
        beforeEach(function() {
            this.obj = {
                doSomething: function() {
                    return;
                }
            };

            sinonSpy(this.obj, "doSomething");

            /*eslint consistent-return: "off"*/
            this.message = function(method) {
                // eslint-disable-next-line no-restricted-syntax
                try {
                    sinonAssert[method].apply(sinonAssert, [].slice.call(arguments, 1));
                } catch (e) {
                    return e.message;
                }
            };
        });

        it("assert.called exception message", function() {
            assert.equals(
                this.message("called", this.obj.doSomething),
                "expected doSomething to have been called at least once but was never called"
            );
        });

        it("assert.notCalled exception message one call", function() {
            this.obj.doSomething();

            assert.equals(
                this.message("notCalled", this.obj.doSomething).replace(/ at.*/g, ""),
                "expected doSomething to not have been called but was called once\n    doSomething()"
            );
        });

        it("assert.notCalled exception message four calls", function() {
            this.obj.doSomething();
            this.obj.doSomething();
            this.obj.doSomething();
            this.obj.doSomething();

            assert.equals(
                this.message("notCalled", this.obj.doSomething).replace(/ at.*/g, ""),
                "expected doSomething to not have been called " +
                    "but was called 4 times\n    doSomething()\n    " +
                    "doSomething()\n    doSomething()\n    doSomething()"
            );
        });

        it("assert.notCalled exception message with calls with arguments", function() {
            this.obj.doSomething();
            this.obj.doSomething(3);
            this.obj.doSomething(42, 1);
            this.obj.doSomething();

            assert.equals(
                this.message("notCalled", this.obj.doSomething).replace(/ at.*/g, ""),
                "expected doSomething to not have been called " +
                    "but was called 4 times\n    doSomething()\n    " +
                    "doSomething(3)\n    doSomething(42, 1)\n    doSomething()"
            );
        });

        it("assert.callOrder exception message", function() {
            var obj = {
                doop: function() {
                    return;
                },
                foo: function() {
                    return;
                }
            };
            sinonSpy(obj, "doop");
            sinonSpy(obj, "foo");

            obj.doop();
            this.obj.doSomething();
            obj.foo();

            var message = this.message("callOrder", this.obj.doSomething, obj.doop, obj.foo);

            assert.equals(
                message,
                "expected doSomething, doop, foo to be called in order but were called as doop, doSomething, foo"
            );
        });

        it("assert.callOrder with missing first call exception message", function() {
            var obj = {
                doop: function() {
                    return;
                },
                foo: function() {
                    return;
                }
            };
            sinonSpy(obj, "doop");
            sinonSpy(obj, "foo");

            obj.foo();

            var message = this.message("callOrder", obj.doop, obj.foo);

            assert.equals(message, "expected doop, foo to be called in order but were called as foo");
        });

        it("assert.callOrder with missing last call exception message", function() {
            var obj = {
                doop: function() {
                    return;
                },
                foo: function() {
                    return;
                }
            };
            sinonSpy(obj, "doop");
            sinonSpy(obj, "foo");

            obj.doop();

            var message = this.message("callOrder", obj.doop, obj.foo);

            assert.equals(message, "expected doop, foo to be called in order but were called as doop");
        });

        it("assert.callCount exception message", function() {
            this.obj.doSomething();

            assert.equals(
                this.message("callCount", this.obj.doSomething, 3).replace(/ at.*/g, ""),
                "expected doSomething to be called thrice but was called once\n    doSomething()"
            );
        });

        it("assert.calledOnce exception message", function() {
            this.obj.doSomething();
            this.obj.doSomething();

            assert.equals(
                this.message("calledOnce", this.obj.doSomething).replace(/ at.*/g, ""),
                "expected doSomething to be called once but was called twice\n    doSomething()\n    doSomething()"
            );

            this.obj.doSomething();

            assert.equals(
                this.message("calledOnce", this.obj.doSomething).replace(/ at.*/g, ""),
                "expected doSomething to be called once but was called " +
                    "thrice\n    doSomething()\n    doSomething()\n    doSomething()"
            );
        });

        it("assert.calledTwice exception message", function() {
            this.obj.doSomething();

            assert.equals(
                this.message("calledTwice", this.obj.doSomething).replace(/ at.*/g, ""),
                "expected doSomething to be called twice but was called once\n    doSomething()"
            );
        });

        it("assert.calledThrice exception message", function() {
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

        it("assert.calledOn exception message", function() {
            this.obj.toString = function() {
                return "[Oh yeah]";
            };

            var obj = {
                toString: function() {
                    return "[Oh no]";
                }
            };
            var obj2 = {
                toString: function() {
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

        it("assert.alwaysCalledOn exception message", function() {
            this.obj.toString = function() {
                return "[Oh yeah]";
            };

            var obj = {
                toString: function() {
                    return "[Oh no]";
                }
            };
            var obj2 = {
                toString: function() {
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

        it("assert.calledWithNew exception message", function() {
            this.obj.doSomething();

            assert.equals(
                this.message("calledWithNew", this.obj.doSomething),
                "expected doSomething to be called with new"
            );
        });

        it("assert.alwaysCalledWithNew exception message", function() {
            new this.obj.doSomething(); // eslint-disable-line no-new, new-cap
            this.obj.doSomething();

            assert.equals(
                this.message("alwaysCalledWithNew", this.obj.doSomething),
                "expected doSomething to always be called with new"
            );
        });

        it("assert.calledWith exception message", function() {
            this.obj.doSomething(4, 3, "hey");

            assert.equals(
                this.message("calledWith", this.obj.doSomething, 1, 3, "hey").replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n" +
                    color.red("4") +
                    " " +
                    color.green("1") +
                    " \n" +
                    "3\n" +
                    "hey"
            );
        });

        it("assert.calledWith exception message with multiple calls", function() {
            this.obj.doSomething(4, 3, "hey");
            this.obj.doSomething(1, 3, "not");

            assert.equals(
                this.message("calledWith", this.obj.doSomething, 1, 3, "hey").replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n" +
                    "Call 1:\n" +
                    color.red("4") +
                    " " +
                    color.green("1") +
                    " \n" +
                    "3\n" +
                    "hey\n" +
                    "Call 2:\n" +
                    "1\n" +
                    "3\n" +
                    color.red("not") +
                    " " +
                    color.green("hey") +
                    " "
            );
        });

        it("assert.calledWith exception message with large object arguments", function() {
            var calledArg = [
                {
                    first: "a",
                    second: { nest: true },
                    third: [{ fourth: { nest: true } }],
                    mismatchKey: true
                },
                "fifth"
            ];
            this.obj.doSomething(calledArg);

            var expectedArg = [
                {
                    first: "a",
                    second: { nest: true },
                    third: [{ fourth: { nest: false } }],
                    mismatchKeyX: true
                },
                "fifth"
            ];
            assert.equals(
                this.message("calledWith", this.obj.doSomething, expectedArg).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n" +
                    "[{\n" +
                    '  first: "a",\n' +
                    color.red("  mismatchKey: true,\n") +
                    color.green("  mismatchKeyX: true,\n") +
                    "  second: { nest: true },\n" +
                    color.red("  third: [{ fourth: { nest: true } }]\n") +
                    color.green("  third: [{ fourth: { nest: false } }]\n") +
                    '}, "fifth"]'
            );
        });

        it("assert.calledWith exception message with a missing argument", function() {
            this.obj.doSomething(4);

            assert.equals(
                this.message("calledWith", this.obj.doSomething, 1, 3).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n" +
                    color.red("4") +
                    " " +
                    color.green("1") +
                    " \n" +
                    color.green("3")
            );
        });

        it("assert.calledWith exception message with an excess argument", function() {
            this.obj.doSomething(4, 3);

            assert.equals(
                this.message("calledWith", this.obj.doSomething, 1).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n" +
                    color.red("4") +
                    " " +
                    color.green("1") +
                    " \n" +
                    color.red("3")
            );
        });

        it("assert.calledWith match.any exception message", function() {
            this.obj.doSomething(true, true);

            assert.equals(
                this.message("calledWith", this.obj.doSomething, match.any, false).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n" +
                    "true any\n" +
                    color.red("true") +
                    " " +
                    color.green("false") +
                    " "
            );
        });

        it("assert.calledWith match.defined exception message", function() {
            this.obj.doSomething();

            assert.equals(
                this.message("calledWith", this.obj.doSomething, match.defined).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n " + color.red("defined")
            );
        });

        it("assert.calledWith match.truthy exception message", function() {
            this.obj.doSomething();

            assert.equals(
                this.message("calledWith", this.obj.doSomething, match.truthy).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n " + color.red("truthy")
            );
        });

        it("assert.calledWith match.falsy exception message", function() {
            this.obj.doSomething(true);

            assert.equals(
                this.message("calledWith", this.obj.doSomething, match.falsy).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n" + color.green("true") + " " + color.red("falsy")
            );
        });

        it("assert.calledWith match.same exception message", function() {
            this.obj.doSomething();

            assert.equals(
                this.message("calledWith", this.obj.doSomething, match.same(1)).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n " + color.red("same(1)")
            );
        });

        it("assert.calledWith match.typeOf exception message", function() {
            this.obj.doSomething();
            var matcher = match.typeOf("string");

            assert.equals(
                this.message("calledWith", this.obj.doSomething, matcher).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n " + color.red('typeOf("string")')
            );
        });

        it("assert.calledWith match.instanceOf exception message", function() {
            this.obj.doSomething();
            var matcher = match.instanceOf(function CustomType() {
                return;
            });

            assert.equals(
                this.message("calledWith", this.obj.doSomething, matcher).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n " + color.red("instanceOf(CustomType)")
            );
        });

        it("assert.calledWith match object exception message", function() {
            this.obj.doSomething();
            var matcher = match({ some: "value", and: 123 });

            assert.equals(
                this.message("calledWith", this.obj.doSomething, matcher).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n " + color.red("match(some: value, and: 123)")
            );
        });

        it("assert.calledWith match boolean exception message", function() {
            this.obj.doSomething();

            assert.equals(
                this.message("calledWith", this.obj.doSomething, match(true)).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n " + color.red("match(true)")
            );
        });

        it("assert.calledWith match number exception message", function() {
            this.obj.doSomething();

            assert.equals(
                this.message("calledWith", this.obj.doSomething, match(123)).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n " + color.red("match(123)")
            );
        });

        it("assert.calledWith match string exception message", function() {
            this.obj.doSomething();
            var matcher = match("Sinon");

            assert.equals(
                this.message("calledWith", this.obj.doSomething, matcher).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n " + color.red('match("Sinon")')
            );
        });

        it("assert.calledWith match regexp exception message", function() {
            this.obj.doSomething();

            assert.equals(
                this.message("calledWith", this.obj.doSomething, match(/[a-z]+/)).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n " + color.red("match(/[a-z]+/)")
            );
        });

        it("assert.calledWith match test function exception message", function() {
            this.obj.doSomething();
            var matcher = match({
                test: function custom() {
                    return;
                }
            });

            assert.equals(
                this.message("calledWith", this.obj.doSomething, matcher).replace(/ at.*/g, ""),
                "expected doSomething to be called with arguments \n " + color.red("match(custom)")
            );
        });

        it("assert.calledWithMatch exception message", function() {
            this.obj.doSomething(1, 3, "hey");

            assert.equals(
                this.message("calledWithMatch", this.obj.doSomething, 4, 3, "hey").replace(/ at.*/g, ""),
                "expected doSomething to be called with match \n" +
                    color.red("1") +
                    " " +
                    color.green("4") +
                    " \n" +
                    "3\n" +
                    "hey"
            );
        });

        it("assert.alwaysCalledWith exception message", function() {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, "hey");

            assert.equals(
                this.message("alwaysCalledWith", this.obj.doSomething, 1, "hey").replace(/ at.*/g, ""),
                "expected doSomething to always be called with arguments \n" +
                    "Call 1:\n" +
                    "1\n" +
                    color.red("3") +
                    " " +
                    color.green("hey") +
                    " \n" +
                    color.red("hey") +
                    "\n" +
                    "Call 2:\n" +
                    "1\n" +
                    "hey"
            );
        });

        it("assert.alwaysCalledWithMatch exception message", function() {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, "hey");

            assert.equals(
                this.message("alwaysCalledWithMatch", this.obj.doSomething, 1, "hey").replace(/ at.*/g, ""),
                "expected doSomething to always be called with match \n" +
                    "Call 1:\n" +
                    "1\n" +
                    color.red("3") +
                    " " +
                    color.green("hey") +
                    " \n" +
                    color.red("hey") +
                    "\n" +
                    "Call 2:\n" +
                    "1\n" +
                    "hey"
            );
        });

        it("assert.calledWithExactly exception message", function() {
            this.obj.doSomething(1, 3, "hey");

            assert.equals(
                this.message("calledWithExactly", this.obj.doSomething, 1, 3).replace(/ at.*/g, ""),
                "expected doSomething to be called with exact arguments \n1\n3\n" + color.red("hey")
            );
        });

        it("assert.alwaysCalledWithExactly exception message", function() {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, 3);

            assert.equals(
                this.message("alwaysCalledWithExactly", this.obj.doSomething, 1, 3).replace(/ at.*/g, ""),
                "expected doSomething to always be called with exact arguments \n" +
                    "Call 1:\n" +
                    "1\n" +
                    "3\n" +
                    color.red("hey") +
                    "\n" +
                    "Call 2:\n" +
                    "1\n" +
                    "3"
            );
        });

        it("assert.neverCalledWith exception message", function() {
            this.obj.doSomething(1, 2, 3);

            assert.equals(
                this.message("neverCalledWith", this.obj.doSomething, 1, 2).replace(/ at.*/g, ""),
                "expected doSomething to never be called with arguments 1, 2\n    doSomething(1, 2, 3)"
            );
        });

        it("assert.neverCalledWithMatch exception message", function() {
            this.obj.doSomething(1, 2, 3);

            assert.equals(
                this.message("neverCalledWithMatch", this.obj.doSomething, 1, 2).replace(/ at.*/g, ""),
                "expected doSomething to never be called with match 1, 2\n    doSomething(1, 2, 3)"
            );
        });

        it("assert.threw exception message", function() {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, 3);

            assert.equals(
                this.message("threw", this.obj.doSomething).replace(/ at.*/g, ""),
                "doSomething did not throw exception\n    doSomething(1, 3, hey)\n    doSomething(1, 3)"
            );
        });

        it("assert.alwaysThrew exception message", function() {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, 3);

            assert.equals(
                this.message("alwaysThrew", this.obj.doSomething).replace(/ at.*/g, ""),
                "doSomething did not always throw exception\n    doSomething(1, 3, hey)\n    doSomething(1, 3)"
            );
        });

        it("assert.match exception message", function() {
            assert.equals(
                this.message("match", { foo: 1 }, [1, 3]),
                "expected value to match\n    expected = [1, 3]\n    actual = { foo: 1 }"
            );
        });
    });

    if (typeof Symbol === "function") {
        describe("with symbol method names", function() {
            var obj = {};

            function setupSymbol(symbol) {
                obj[symbol] = function() {
                    return;
                };
                sinonSpy(obj, symbol);
            }

            function createExceptionMessage(method, arg) {
                // eslint-disable-next-line no-restricted-syntax
                try {
                    sinonAssert[method](arg);
                } catch (e) {
                    return e.message;
                }
            }

            it("should use the symbol's description in exception messages", function() {
                var symbol = Symbol("Something Symbolic");
                setupSymbol(symbol);

                assert.equals(
                    createExceptionMessage("called", obj[symbol]),
                    "expected Symbol(Something Symbolic) to have been called at least once but was never called"
                );
            });

            it(
                "should indicate that an assertion failure with a symbol method name " +
                    "occured in exception messages, even if the symbol has no description",
                function() {
                    var symbol = Symbol();
                    setupSymbol(symbol);

                    assert.equals(
                        createExceptionMessage("called", obj[symbol]),
                        "expected Symbol() to have been called at least once but was never called"
                    );
                }
            );
        });
    }
});
