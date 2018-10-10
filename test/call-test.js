"use strict";

var color = require("../lib/sinon/color");
var referee = require("@sinonjs/referee");
var sinonSpyCall = require("../lib/sinon/call");
var sinonSpy = require("../lib/sinon/spy");
var sinonStub = require("../lib/sinon/stub");
var assert = referee.assert;
var refute = referee.refute;

function spyCallSetUp() {
    this.thisValue = {};
    this.args = [{}, [], new Error(), 3];
    this.returnValue = function() {
        return;
    };
    this.call = sinonSpyCall(
        function() {
            return;
        },
        this.thisValue,
        this.args,
        this.returnValue,
        null,
        0
    );
}

function spyCallCallSetup() {
    this.args = [];
    this.proxy = sinonSpy();
    this.call = sinonSpyCall(this.proxy, {}, this.args, null, null, 0);
}

function spyCallCalledTests(method) {
    return function() {
        // eslint-disable-next-line mocha/no-top-level-hooks
        beforeEach(spyCallSetUp);

        it("returns true if all args match", function() {
            var args = this.args;

            assert(this.call[method](args[0], args[1], args[2]));
        });

        it("returns true if first args match", function() {
            var args = this.args;

            assert(this.call[method](args[0], args[1]));
        });

        it("returns true if first arg match", function() {
            var args = this.args;

            assert(this.call[method](args[0]));
        });

        it("returns true for no args", function() {
            assert(this.call[method]());
        });

        it("returns false for too many args", function() {
            var args = this.args;

            assert.isFalse(this.call[method](args[0], args[1], args[2], args[3], {}));
        });

        it("returns false for wrong arg", function() {
            var args = this.args;

            assert.isFalse(this.call[method](args[0], args[2]));
        });
    };
}

function spyCallNotCalledTests(method) {
    return function() {
        // eslint-disable-next-line mocha/no-top-level-hooks, mocha/no-sibling-hooks
        beforeEach(spyCallSetUp);

        it("returns false if all args match", function() {
            var args = this.args;

            assert.isFalse(this.call[method](args[0], args[1], args[2]));
        });

        it("returns false if first args match", function() {
            var args = this.args;

            assert.isFalse(this.call[method](args[0], args[1]));
        });

        it("returns false if first arg match", function() {
            var args = this.args;

            assert.isFalse(this.call[method](args[0]));
        });

        it("returns false for no args", function() {
            assert.isFalse(this.call[method]());
        });

        it("returns true for too many args", function() {
            var args = this.args;

            assert(this.call[method](args[0], args[1], args[2], args[3], {}));
        });

        it("returns true for wrong arg", function() {
            var args = this.args;

            assert(this.call[method](args[0], args[2]));
        });
    };
}

describe("sinonSpy.call", function() {
    describe("call object", function() {
        beforeEach(spyCallSetUp);

        it("gets call object", function() {
            var spy = sinonSpy.create();
            spy();
            var firstCall = spy.getCall(0);

            assert.isFunction(firstCall.calledOn);
            assert.isFunction(firstCall.calledWith);
            assert.isFunction(firstCall.returned);
        });

        it("stores given call id", function() {
            var call = sinonSpyCall(
                function() {
                    return;
                },
                {},
                [],
                null,
                null,
                42
            );

            assert.same(call.callId, 42);
        });

        it("throws if callId is undefined", function() {
            assert.exception(function() {
                sinonSpyCall.create(
                    function() {
                        return;
                    },
                    {},
                    []
                );
            });
        });

        // This is actually a spy test:
        it("records ascending call id's", function() {
            var spy = sinonSpy();
            spy();

            assert(this.call.callId < spy.getCall(0).callId);
        });

        it("exposes thisValue property", function() {
            var spy = sinonSpy();
            var obj = {};
            spy.call(obj);

            assert.same(spy.getCall(0).thisValue, obj);
        });

        it("has methods to test relative ordering", function() {
            var spy = sinonSpy();
            for (var i = 0; i < 4; i++) {
                spy.call({});
            }

            var calls = [0, 1, 2, 3].map(function(idx) {
                return spy.getCall(idx);
            });

            assert.equals(calls[1].calledBefore(calls[3]), true);
            assert.equals(calls[1].calledBefore(calls[0]), false);

            assert.equals(calls[3].calledAfter(calls[1]), true);
            assert.equals(calls[1].calledAfter(calls[3]), false);

            assert.equals(calls[0].calledImmediatelyBefore(calls[2]), false);
            assert.equals(calls[1].calledImmediatelyBefore(calls[2]), true);
            assert.equals(calls[3].calledImmediatelyBefore(calls[1]), false);

            assert.equals(calls[3].calledImmediatelyAfter(calls[1]), false);
            assert.equals(calls[2].calledImmediatelyAfter(calls[1]), true);
            assert.equals(calls[1].calledImmediatelyAfter(calls[3]), false);
        });
    });

    describe("call calledOn", function() {
        beforeEach(spyCallSetUp);

        it("calledOn should return true", function() {
            assert(this.call.calledOn(this.thisValue));
        });

        it("calledOn should return false", function() {
            assert.isFalse(this.call.calledOn({}));
        });
    });

    describe("call.calledWith", spyCallCalledTests("calledWith"));
    describe("call.calledWithMatch", spyCallCalledTests("calledWithMatch"));
    describe("call.notCalledWith", spyCallNotCalledTests("notCalledWith"));
    describe("call.notCalledWithMatch", spyCallNotCalledTests("notCalledWithMatch"));

    describe("call.calledWithExactly", function() {
        beforeEach(spyCallSetUp);

        it("returns true when all args match", function() {
            var args = this.args;

            assert(this.call.calledWithExactly(args[0], args[1], args[2], args[3]));
        });

        it("returns false for too many args", function() {
            var args = this.args;

            assert.isFalse(this.call.calledWithExactly(args[0], args[1], args[2], args[3], {}));
        });

        it("returns false for too few args", function() {
            var args = this.args;

            assert.isFalse(this.call.calledWithExactly(args[0], args[1]));
        });

        it("returns false for unmatching args", function() {
            var args = this.args;

            assert.isFalse(this.call.calledWithExactly(args[0], args[1], args[1]));
        });

        it("returns true for no arguments", function() {
            var call = sinonSpyCall(
                function() {
                    return;
                },
                {},
                [],
                null,
                null,
                0
            );

            assert(call.calledWithExactly());
        });

        it("returns false when called with no args but matching one", function() {
            var call = sinonSpyCall(
                function() {
                    return;
                },
                {},
                [],
                null,
                null,
                0
            );

            assert.isFalse(call.calledWithExactly({}));
        });
    });

    describe("call.callArg", function() {
        beforeEach(spyCallCallSetup);

        it("calls argument at specified index", function() {
            var callback = sinonSpy();
            this.args.push(1, 2, callback);

            this.call.callArg(2);

            assert(callback.called);
        });

        it("throws if argument at specified index is not callable", function() {
            this.args.push(1);
            var call = this.call;

            assert.exception(
                function() {
                    call.callArg(0);
                },
                { message: "Expected argument at position 0 to be a Function, but was number" }
            );
        });

        it("throws if no index is specified", function() {
            var call = this.call;

            assert.exception(
                function() {
                    call.callArg();
                },
                { name: "TypeError" }
            );
        });

        it("returns callbacks return value", function() {
            var callback = sinonSpy(function() {
                return "useful value";
            });
            this.args.push(1, 2, callback);

            var returnValue = this.call.callArg(2);

            assert.equals(returnValue, "useful value");
        });

        it("throws if index is not number", function() {
            var call = this.call;

            assert.exception(
                function() {
                    call.callArg({});
                },
                { name: "TypeError" }
            );
        });
    });

    describe("call.callArgOn", function() {
        beforeEach(spyCallCallSetup);

        it("calls argument at specified index", function() {
            var callback = sinonSpy();
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(1, 2, callback);

            this.call.callArgOn(2, thisObj);

            assert(callback.called);
            assert(callback.calledOn(thisObj));
        });

        it("throws if argument at specified index is not callable", function() {
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(1);
            var call = this.call;

            assert.exception(
                function() {
                    call.callArgOn(0, thisObj);
                },
                { message: "Expected argument at position 0 to be a Function, but was number" }
            );
        });

        it("returns callbacks return value", function() {
            var callback = sinonSpy(function() {
                return "useful value";
            });
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(1, 2, callback);

            var returnValue = this.call.callArgOn(2, thisObj);

            assert.equals(returnValue, "useful value");
        });

        it("throws if index is not number", function() {
            var thisObj = { name1: "value1", name2: "value2" };
            var call = this.call;

            assert.exception(
                function() {
                    call.callArgOn({}, thisObj);
                },
                { name: "TypeError" }
            );
        });
    });

    describe("call.callArgWith", function() {
        beforeEach(spyCallCallSetup);

        it("calls argument at specified index with provided args", function() {
            var object = {};
            var callback = sinonSpy();
            this.args.push(1, callback);

            this.call.callArgWith(1, object);

            assert(callback.calledWith(object));
        });

        it("calls callback without args", function() {
            var callback = sinonSpy();
            this.args.push(1, callback);

            this.call.callArgWith(1);

            assert(callback.calledWith());
        });

        it("calls callback wit multiple args", function() {
            var object = {};
            var array = [];
            var callback = sinonSpy();
            this.args.push(1, 2, callback);

            this.call.callArgWith(2, object, array);

            assert(callback.calledWith(object, array));
        });

        it("returns callbacks return value", function() {
            var object = {};
            var callback = sinonSpy(function() {
                return "useful value";
            });
            this.args.push(1, callback);

            var returnValue = this.call.callArgWith(1, object);

            assert.equals(returnValue, "useful value");
        });

        it("throws if no index is specified", function() {
            var call = this.call;

            assert.exception(
                function() {
                    call.callArgWith();
                },
                { name: "TypeError" }
            );
        });

        it("throws if index is not number", function() {
            var call = this.call;

            assert.exception(
                function() {
                    call.callArgWith({});
                },
                { name: "TypeError" }
            );
        });
    });

    describe("call.callArgOnWith", function() {
        beforeEach(spyCallCallSetup);

        it("calls argument at specified index with provided args", function() {
            var object = {};
            var thisObj = { name1: "value1", name2: "value2" };
            var callback = sinonSpy();
            this.args.push(1, callback);

            this.call.callArgOnWith(1, thisObj, object);

            assert(callback.calledWith(object));
            assert(callback.calledOn(thisObj));
        });

        it("calls callback without args", function() {
            var callback = sinonSpy();
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(1, callback);

            this.call.callArgOnWith(1, thisObj);

            assert(callback.calledWith());
            assert(callback.calledOn(thisObj));
        });

        it("calls callback with multiple args", function() {
            var object = {};
            var array = [];
            var thisObj = { name1: "value1", name2: "value2" };
            var callback = sinonSpy();
            this.args.push(1, 2, callback);

            this.call.callArgOnWith(2, thisObj, object, array);

            assert(callback.calledWith(object, array));
            assert(callback.calledOn(thisObj));
        });

        it("returns callbacks return value", function() {
            var object = {};
            var thisObj = { name1: "value1", name2: "value2" };
            var callback = sinonSpy(function() {
                return "useful value";
            });
            this.args.push(1, callback);

            var returnValue = this.call.callArgOnWith(1, thisObj, object);

            assert.equals(returnValue, "useful value");
        });

        it("throws if argument at specified index is not callable", function() {
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(1, 2, 1);
            var call = this.call;

            assert.exception(
                function() {
                    call.callArgOnWith(2, thisObj);
                },
                { message: "Expected argument at position 2 to be a Function, but was number" }
            );
        });

        it("throws if index is not number", function() {
            var thisObj = { name1: "value1", name2: "value2" };
            var call = this.call;

            assert.exception(
                function() {
                    call.callArgOnWith({}, thisObj);
                },
                { name: "TypeError" }
            );
        });
    });

    describe(".callback", function() {
        it("it should be a reference for the callback", function() {
            var spy = sinonSpy();
            var callback1 = function() {
                return;
            };
            var callback2 = function() {
                return;
            };

            spy(1, 2, 3, callback1);
            assert.equals(spy.getCall(0).callback, callback1);

            spy(1, 2, 3, callback2);
            assert.equals(spy.getCall(1).callback, callback2);

            spy(1, 2, 3);
            assert.equals(spy.getCall(2).callback, undefined);
        });
    });

    describe(".lastArg", function() {
        it("should be the last argument from the call", function() {
            var spy = sinonSpy();

            spy(41, 42, 43);
            assert.equals(spy.getCall(0).lastArg, 43);

            spy(44, 45);
            assert.equals(spy.getCall(1).lastArg, 45);

            spy(46);
            assert.equals(spy.getCall(2).lastArg, 46);

            spy();
            assert.equals(spy.getCall(3).lastArg, undefined);
        });
    });

    describe("call.yieldTest", function() {
        beforeEach(spyCallCallSetup);

        it("invokes only argument as callback", function() {
            var callback = sinonSpy();
            this.args.push(callback);

            this.call.yield();

            assert(callback.calledOnce);
            assert.equals(callback.args[0].length, 0);
        });

        it("throws understandable error if no callback is passed", function() {
            var call = this.call;

            assert.exception(
                function() {
                    call.yield();
                },
                {
                    message: "spy cannot yield since no callback was passed."
                }
            );
        });

        it("includes stub name and actual arguments in error", function() {
            this.proxy.displayName = "somethingAwesome";
            this.args.push(23, 42);
            var call = this.call;

            assert.exception(
                function() {
                    call.yield();
                },
                {
                    message: "somethingAwesome cannot yield since no callback was passed. Received [23, 42]"
                }
            );
        });

        it("invokes last argument as callback", function() {
            var spy = sinonSpy();
            this.args.push(24, {}, spy);

            this.call.yield();

            assert(spy.calledOnce);
            assert.equals(spy.args[0].length, 0);
        });

        it("invokes first of two callbacks", function() {
            var spy = sinonSpy();
            var spy2 = sinonSpy();
            this.args.push(24, {}, spy, spy2);

            this.call.yield();

            assert(spy.calledOnce);
            assert.isFalse(spy2.called);
        });

        it("invokes callback with arguments", function() {
            var obj = { id: 42 };
            var spy = sinonSpy();
            this.args.push(spy);

            this.call.yield(obj, "Crazy");

            assert(spy.calledWith(obj, "Crazy"));
        });

        it("returns callbacks return value", function() {
            var spy = sinonSpy(function() {
                return "useful value";
            });
            this.args.push(24, {}, spy);

            var returnValue = this.call.yield();

            assert.equals(returnValue, "useful value");
        });

        it("throws if callback throws", function() {
            this.args.push(function() {
                throw new Error("d'oh!");
            });
            var call = this.call;

            assert.exception(function() {
                call.yield();
            });
        });
    });

    describe("call.invokeCallback", function() {
        it("is alias for yield", function() {
            var call = sinonSpyCall(
                function() {
                    return;
                },
                {},
                [],
                null,
                null,
                0
            );

            assert.same(call.yield, call.invokeCallback);
        });
    });

    describe("call.yieldOnTest", function() {
        beforeEach(spyCallCallSetup);

        it("invokes only argument as callback", function() {
            var callback = sinonSpy();
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(callback);

            this.call.yieldOn(thisObj);

            assert(callback.calledOnce);
            assert(callback.calledOn(thisObj));
            assert.equals(callback.args[0].length, 0);
        });

        it("throws understandable error if no callback is passed", function() {
            var call = this.call;
            var thisObj = { name1: "value1", name2: "value2" };

            assert.exception(
                function() {
                    call.yieldOn(thisObj);
                },
                {
                    message: "spy cannot yield since no callback was passed."
                }
            );
        });

        it("includes stub name and actual arguments in error", function() {
            this.proxy.displayName = "somethingAwesome";
            this.args.push(23, 42);
            var call = this.call;
            var thisObj = { name1: "value1", name2: "value2" };

            assert.exception(
                function() {
                    call.yieldOn(thisObj);
                },
                {
                    message: "somethingAwesome cannot yield since no callback was passed. Received [23, 42]"
                }
            );
        });

        it("invokes last argument as callback", function() {
            var spy = sinonSpy();
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(24, {}, spy);

            this.call.yieldOn(thisObj);

            assert(spy.calledOnce);
            assert.equals(spy.args[0].length, 0);
            assert(spy.calledOn(thisObj));
        });

        it("invokes first of two callbacks", function() {
            var spy = sinonSpy();
            var spy2 = sinonSpy();
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(24, {}, spy, spy2);

            this.call.yieldOn(thisObj);

            assert(spy.calledOnce);
            assert(spy.calledOn(thisObj));
            assert.isFalse(spy2.called);
        });

        it("invokes callback with arguments", function() {
            var obj = { id: 42 };
            var spy = sinonSpy();
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(spy);

            this.call.yieldOn(thisObj, obj, "Crazy");

            assert(spy.calledWith(obj, "Crazy"));
            assert(spy.calledOn(thisObj));
        });

        it("returns callbacks return value", function() {
            var spy = sinonSpy(function() {
                return "useful value";
            });
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(24, {}, spy);

            var returnValue = this.call.yieldOn(thisObj);

            assert.equals(returnValue, "useful value");
        });

        it("throws if callback throws", function() {
            this.args.push(function() {
                throw new Error("d'oh!");
            });
            var call = this.call;
            var thisObj = { name1: "value1", name2: "value2" };

            assert.exception(function() {
                call.yieldOn(thisObj);
            });
        });
    });

    describe("call.yieldTo", function() {
        beforeEach(spyCallCallSetup);

        it("invokes only argument as callback", function() {
            var callback = sinonSpy();
            this.args.push({
                success: callback
            });

            this.call.yieldTo("success");

            assert(callback.calledOnce);
            assert.equals(callback.args[0].length, 0);
        });

        it("throws understandable error if no callback is passed", function() {
            var call = this.call;

            assert.exception(
                function() {
                    call.yieldTo("success");
                },
                {
                    message: "spy cannot yield to 'success' since no callback was passed."
                }
            );
        });

        it("includes stub name and actual arguments in error", function() {
            this.proxy.displayName = "somethingAwesome";
            this.args.push(23, 42);
            var call = this.call;

            assert.exception(
                function() {
                    call.yieldTo("success");
                },
                {
                    message:
                        "somethingAwesome cannot yield to 'success' since no callback was passed. " +
                        "Received [23, 42]"
                }
            );
        });

        it("invokes property on last argument as callback", function() {
            var spy = sinonSpy();
            this.args.push(24, {}, { success: spy });

            this.call.yieldTo("success");

            assert(spy.calledOnce);
            assert.equals(spy.args[0].length, 0);
        });

        it("invokes first of two possible callbacks", function() {
            var spy = sinonSpy();
            var spy2 = sinonSpy();
            this.args.push(24, {}, { error: spy }, { error: spy2 });

            this.call.yieldTo("error");

            assert(spy.calledOnce);
            assert.isFalse(spy2.called);
        });

        it("invokes callback with arguments", function() {
            var obj = { id: 42 };
            var spy = sinonSpy();
            this.args.push({ success: spy });

            this.call.yieldTo("success", obj, "Crazy");

            assert(spy.calledWith(obj, "Crazy"));
        });

        it("returns callbacks return value", function() {
            var spy = sinonSpy(function() {
                return "useful value";
            });
            this.args.push(24, {}, { success: spy });

            var returnValue = this.call.yieldTo("success");

            assert.equals(returnValue, "useful value");
        });

        it("throws if callback throws", function() {
            this.args.push({
                success: function() {
                    throw new Error("d'oh!");
                }
            });
            var call = this.call;

            assert.exception(function() {
                call.yieldTo("success");
            });
        });
    });

    describe("call.yieldToOn", function() {
        beforeEach(spyCallCallSetup);

        it("invokes only argument as callback", function() {
            var callback = sinonSpy();
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push({
                success: callback
            });

            this.call.yieldToOn("success", thisObj);

            assert(callback.calledOnce);
            assert.equals(callback.args[0].length, 0);
            assert(callback.calledOn(thisObj));
        });

        it("throws understandable error if no callback is passed", function() {
            var call = this.call;
            var thisObj = { name1: "value1", name2: "value2" };

            assert.exception(
                function() {
                    call.yieldToOn("success", thisObj);
                },
                {
                    message: "spy cannot yield to 'success' since no callback was passed."
                }
            );
        });

        it("throws understandable error if symbol prop is not found", function() {
            if (typeof Symbol === "function") {
                var call = this.call;
                var symbol = Symbol();

                assert.exception(
                    function() {
                        call.yieldToOn(symbol, {});
                    },
                    {
                        message: "spy cannot yield to 'Symbol()' since no callback was passed."
                    }
                );
            }
        });

        it("includes stub name and actual arguments in error", function() {
            this.proxy.displayName = "somethingAwesome";
            this.args.push(23, 42);
            var call = this.call;
            var thisObj = { name1: "value1", name2: "value2" };

            assert.exception(
                function() {
                    call.yieldToOn("success", thisObj);
                },
                {
                    message:
                        "somethingAwesome cannot yield to 'success' since no callback was passed. " +
                        "Received [23, 42]"
                }
            );
        });

        it("invokes property on last argument as callback", function() {
            var spy = sinonSpy();
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(24, {}, { success: spy });

            this.call.yieldToOn("success", thisObj);

            assert(spy.calledOnce);
            assert(spy.calledOn(thisObj));
            assert.equals(spy.args[0].length, 0);
        });

        it("invokes first of two possible callbacks", function() {
            var spy = sinonSpy();
            var spy2 = sinonSpy();
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(24, {}, { error: spy }, { error: spy2 });

            this.call.yieldToOn("error", thisObj);

            assert(spy.calledOnce);
            assert(spy.calledOn(thisObj));
            assert.isFalse(spy2.called);
        });

        it("invokes callback with arguments", function() {
            var obj = { id: 42 };
            var spy = sinonSpy();
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push({ success: spy });

            this.call.yieldToOn("success", thisObj, obj, "Crazy");

            assert(spy.calledWith(obj, "Crazy"));
            assert(spy.calledOn(thisObj));
        });

        it("returns callbacks return value", function() {
            var spy = sinonSpy(function() {
                return "useful value";
            });
            var thisObj = { name1: "value1", name2: "value2" };
            this.args.push(24, {}, { success: spy });

            var returnValue = this.call.yieldToOn("success", thisObj);

            assert.equals(returnValue, "useful value");
        });

        it("throws if callback throws", function() {
            this.args.push({
                success: function() {
                    throw new Error("d'oh!");
                }
            });
            var call = this.call;
            var thisObj = { name1: "value1", name2: "value2" };

            assert.exception(function() {
                call.yieldToOn("success", thisObj);
            });
        });
    });

    describe("call.toString", function() {
        afterEach(function() {
            if (this.format) {
                this.format.restore();
            }
        });

        it("includes spy name", function() {
            var object = { doIt: sinonSpy() };
            object.doIt();

            assert.equals(
                object.doIt
                    .getCall(0)
                    .toString()
                    .replace(/ at.*/g, ""),
                "doIt()"
            );
        });

        it("includes single argument", function() {
            var object = { doIt: sinonSpy() };
            object.doIt(42);

            assert.equals(
                object.doIt
                    .getCall(0)
                    .toString()
                    .replace(/ at.*/g, ""),
                "doIt(42)"
            );
        });

        it("includes all arguments", function() {
            var object = { doIt: sinonSpy() };
            object.doIt(42, "Hey");

            assert.equals(
                object.doIt
                    .getCall(0)
                    .toString()
                    .replace(/ at.*/g, ""),
                "doIt(42, Hey)"
            );
        });

        it("includes explicit return value", function() {
            var object = { doIt: sinonStub().returns(42) };
            object.doIt(42, "Hey");

            assert.equals(
                object.doIt
                    .getCall(0)
                    .toString()
                    .replace(/ at.*/g, ""),
                "doIt(42, Hey) => 42"
            );
        });

        it("includes empty string return value", function() {
            var object = { doIt: sinonStub().returns("") };
            object.doIt(42, "Hey");

            assert.equals(
                object.doIt
                    .getCall(0)
                    .toString()
                    .replace(/ at.*/g, ""),
                "doIt(42, Hey) => (empty string)"
            );
        });

        it("includes exception", function() {
            var object = { doIt: sinonStub().throws("TypeError") };

            assert.exception(function() {
                object.doIt();
            });

            assert.equals(
                object.doIt
                    .getCall(0)
                    .toString()
                    .replace(/ at.*/g, ""),
                "doIt() !TypeError"
            );
        });

        it("includes exception message if any", function() {
            var object = { doIt: sinonStub().throws("TypeError", "Oh noes!") };

            assert.exception(function() {
                object.doIt();
            });

            assert.equals(
                object.doIt
                    .getCall(0)
                    .toString()
                    .replace(/ at.*/g, ""),
                "doIt() !TypeError(Oh noes!)"
            );
        });

        // these tests are ensuring that call.toString is handled by sinonFormat
        it("formats arguments with sinonFormat", function() {
            var object = { doIt: sinonSpy() };

            object.doIt(42);

            assert.equals(
                object.doIt
                    .getCall(0)
                    .toString()
                    .replace(/ at.*/g, ""),
                "doIt(42)"
            );
        });

        it("formats return value with sinonFormat", function() {
            var object = { doIt: sinonStub().returns(42) };

            object.doIt();

            assert.equals(
                object.doIt
                    .getCall(0)
                    .toString()
                    .replace(/ at.*/g, ""),
                "doIt() => 42"
            );
        });

        // https://github.com/sinonjs/sinon/issues/1066
        /* eslint-disable consistent-return */
        it("does not throw when the call stack is empty", function(done) {
            if (!global.Promise) {
                this.skip();
            }

            var stub1 = sinonStub().resolves(1);
            var stub2 = sinonStub().returns(1);

            function run() {
                return stub1().then(stub2);
            }

            run()
                .then(function() {
                    assert.equals(
                        stub2
                            .getCall(0)
                            .toString()
                            .replace(/ at.*/g, ""),
                        "stub(1) => 1"
                    );
                    done();
                })
                .catch(done);
        });
        /* eslint-enable consistent-return */
    });

    describe("constructor", function() {
        beforeEach(function() {
            this.CustomConstructor = function() {
                return;
            };
            this.customPrototype = this.CustomConstructor.prototype;
            sinonSpy(this, "CustomConstructor");
        });

        it("creates original object", function() {
            var myInstance = new this.CustomConstructor();

            assert(this.customPrototype.isPrototypeOf(myInstance));
        });

        it("does not interfere with instanceof", function() {
            var myInstance = new this.CustomConstructor();

            assert(myInstance instanceof this.CustomConstructor);
        });

        it("records usage", function() {
            var myInstance = new this.CustomConstructor(); // eslint-disable-line no-unused-vars

            assert(this.CustomConstructor.called);
        });
    });

    describe("functions", function() {
        it("throws if spying on non-existent property", function() {
            var myObj = {};

            assert.exception(function() {
                sinonSpy(myObj, "ouch");
            });

            refute.defined(myObj.ouch);
        });

        it("throws if spying on non-existent object", function() {
            assert.exception(function() {
                sinonSpy(undefined, "ouch");
            });
        });

        it("haves toString method", function() {
            var obj = {
                meth: function() {
                    return;
                }
            };
            sinonSpy(obj, "meth");

            assert.equals(obj.meth.toString(), "meth");
        });

        it("toString should say 'spy' when unable to infer name", function() {
            var spy = sinonSpy();

            assert.equals(spy.toString(), "spy");
        });

        it("toString should report name of spied function", function() {
            function myTestFunc() {
                return;
            }
            var spy = sinonSpy(myTestFunc);

            assert.equals(spy.toString(), "myTestFunc");
        });

        it("toString should prefer displayName property if available", function() {
            function myTestFunc() {
                return;
            }
            myTestFunc.displayName = "My custom method";
            var spy = sinonSpy(myTestFunc);

            assert.equals(spy.toString(), "My custom method");
        });

        it("toString should prefer property name if possible", function() {
            var obj = {};
            obj.meth = sinonSpy();
            obj.meth();

            assert.equals(obj.meth.toString(), "meth");
        });
    });

    describe(".reset", function() {
        function assertReset(spy) {
            assert(!spy.called);
            assert(!spy.calledOnce);
            assert.equals(spy.args.length, 0);
            assert.equals(spy.returnValues.length, 0);
            assert.equals(spy.exceptions.length, 0);
            assert.equals(spy.thisValues.length, 0);
            assert.isNull(spy.firstCall);
            assert.isNull(spy.secondCall);
            assert.isNull(spy.thirdCall);
            assert.isNull(spy.lastCall);
        }

        it("resets spy state", function() {
            var spy = sinonSpy();
            spy();

            spy.resetHistory();

            assertReset(spy);
        });

        it("resets call order state", function() {
            var spies = [sinonSpy(), sinonSpy()];
            spies[0]();
            spies[1]();

            spies[0].resetHistory();

            assert(!spies[0].calledBefore(spies[1]));
        });

        it("resets fakes returned by withArgs", function() {
            var spy = sinonSpy();
            var fakeA = spy.withArgs("a");
            var fakeB = spy.withArgs("b");
            spy("a");
            spy("b");
            spy("c");
            var fakeC = spy.withArgs("c");

            spy.resetHistory();

            assertReset(fakeA);
            assertReset(fakeB);
            assertReset(fakeC);
        });
    });

    describe(".withArgs", function() {
        it("defines withArgs method", function() {
            var spy = sinonSpy();

            assert.isFunction(spy.withArgs);
        });

        it("records single call", function() {
            var spy = sinonSpy().withArgs(1);
            spy(1);

            assert.equals(spy.callCount, 1);
        });

        it("records non-matching call on original spy", function() {
            var spy = sinonSpy();
            var argSpy = spy.withArgs(1);
            spy(1);
            spy(2);

            assert.equals(spy.callCount, 2);
            assert.equals(argSpy.callCount, 1);
        });

        it("records non-matching call with several arguments separately", function() {
            var spy = sinonSpy();
            var argSpy = spy.withArgs(1, "str", {});
            spy(1);
            spy(1, "str", {});

            assert.equals(spy.callCount, 2);
            assert.equals(argSpy.callCount, 1);
        });

        it("records for partial argument match", function() {
            var spy = sinonSpy();
            var argSpy = spy.withArgs(1, "str", {});
            spy(1);
            spy(1, "str", {});
            spy(1, "str", {}, []);

            assert.equals(spy.callCount, 3);
            assert.equals(argSpy.callCount, 2);
        });

        it("records filtered spy when original throws", function() {
            var spy = sinonSpy(function() {
                throw new Error("Oops");
            });

            var argSpy = spy.withArgs({}, []);

            assert.exception(function() {
                spy(1);
            });

            assert.exception(function() {
                spy({}, []);
            });

            assert.equals(spy.callCount, 2);
            assert.equals(argSpy.callCount, 1);
        });

        it("returns existing override for arguments", function() {
            var spy = sinonSpy();
            var argSpy = spy.withArgs({}, []);
            var another = spy.withArgs({}, []);
            spy();
            spy({}, []);
            spy({}, [], 2);

            assert.same(another, argSpy);
            refute.same(another, spy);
            assert.equals(spy.callCount, 3);
            assert.equals(spy.withArgs({}, []).callCount, 2);
        });

        it("chains withArgs calls on original spy", function() {
            var spy = sinonSpy();
            var numArgSpy = spy.withArgs({}, []).withArgs(3);
            spy();
            spy({}, []);
            spy(3);

            assert.equals(spy.callCount, 3);
            assert.equals(numArgSpy.callCount, 1);
            assert.equals(spy.withArgs({}, []).callCount, 1);
        });

        it("initializes filtered spy with callCount", function() {
            var spy = sinonSpy();
            spy("a");
            spy("b");
            spy("b");
            spy("c");
            spy("c");
            spy("c");

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");
            var argSpy3 = spy.withArgs("c");

            assert.equals(argSpy1.callCount, 1);
            assert.equals(argSpy2.callCount, 2);
            assert.equals(argSpy3.callCount, 3);
            assert(argSpy1.called);
            assert(argSpy2.called);
            assert(argSpy3.called);
            assert(argSpy1.calledOnce);
            assert(argSpy2.calledTwice);
            assert(argSpy3.calledThrice);
        });

        it("initializes filtered spy with first, second, third and last call", function() {
            var spy = sinonSpy();
            spy("a", 1);
            spy("b", 2);
            spy("b", 3);
            spy("b", 4);

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy1.firstCall.calledWithExactly("a", 1));
            assert(argSpy1.lastCall.calledWithExactly("a", 1));
            assert(argSpy2.firstCall.calledWithExactly("b", 2));
            assert(argSpy2.secondCall.calledWithExactly("b", 3));
            assert(argSpy2.thirdCall.calledWithExactly("b", 4));
            assert(argSpy2.lastCall.calledWithExactly("b", 4));
        });

        it("initializes filtered spy with arguments", function() {
            var spy = sinonSpy();
            spy("a");
            spy("b");
            spy("b", "c", "d");

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy1.getCall(0).calledWithExactly("a"));
            assert(argSpy2.getCall(0).calledWithExactly("b"));
            assert(argSpy2.getCall(1).calledWithExactly("b", "c", "d"));
        });

        it("initializes filtered spy with thisValues", function() {
            var spy = sinonSpy();
            var thisValue1 = {};
            var thisValue2 = {};
            var thisValue3 = {};
            spy.call(thisValue1, "a");
            spy.call(thisValue2, "b");
            spy.call(thisValue3, "b");

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy1.getCall(0).calledOn(thisValue1));
            assert(argSpy2.getCall(0).calledOn(thisValue2));
            assert(argSpy2.getCall(1).calledOn(thisValue3));
        });

        it("initializes filtered spy with return values", function() {
            var spy = sinonSpy(function(value) {
                return value;
            });
            spy("a");
            spy("b");
            spy("b");

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy1.getCall(0).returned("a"));
            assert(argSpy2.getCall(0).returned("b"));
            assert(argSpy2.getCall(1).returned("b"));
        });

        it("initializes filtered spy with call order", function() {
            var spy = sinonSpy();
            spy("a");
            spy("b");
            spy("b");

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy2.getCall(0).calledAfter(argSpy1.getCall(0)));
            assert(argSpy2.getCall(1).calledAfter(argSpy1.getCall(0)));
        });

        it("initializes filtered spy with exceptions", function() {
            var spy = sinonSpy(function(x, y) {
                var error = new Error();
                error.name = y;
                throw error;
            });

            assert.exception(function() {
                spy("a", "1");
            });
            assert.exception(function() {
                spy("b", "2");
            });
            assert.exception(function() {
                spy("b", "3");
            });

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy1.getCall(0).threw("1"));
            assert(argSpy2.getCall(0).threw("2"));
            assert(argSpy2.getCall(1).threw("3"));
        });
    });

    describe(".printf", function() {
        describe("name", function() {
            it("named", function() {
                var named = sinonSpy(function cool() {
                    return;
                });
                assert.equals(named.printf("%n"), "cool");
            });
            it("anon", function() {
                var anon = sinonSpy(function() {
                    return;
                });
                assert.equals(anon.printf("%n"), "spy");

                var noFn = sinonSpy();
                assert.equals(noFn.printf("%n"), "spy");
            });
        });

        it("count", function() {
            // Throwing just to make sure it has no effect.
            var spy = sinonSpy(sinonStub().throws());
            function call() {
                assert.exception(function() {
                    spy();
                });
            }

            call();
            assert.equals(spy.printf("%c"), "once");
            call();
            assert.equals(spy.printf("%c"), "twice");
            call();
            assert.equals(spy.printf("%c"), "thrice");
            call();
            assert.equals(spy.printf("%c"), "4 times");
        });

        describe("calls", function() {
            it("oneLine", function() {
                function verify(arg, expected) {
                    var spy = sinonSpy();
                    spy(arg);
                    assert.equals(spy.printf("%C").replace(/ at.*/g, ""), "\n    " + expected);
                }

                verify(true, "spy(true)");
                verify(false, "spy(false)");
                verify(undefined, "spy(undefined)");
                verify(1, "spy(1)");
                verify(0, "spy(0)");
                verify(-1, "spy(-1)");
                verify(-1.1, "spy(-1.1)");
                verify(Infinity, "spy(Infinity)");
                verify(["a"], 'spy(["a"])');
                verify({ a: "a" }, 'spy({ a: "a" })');
            });

            it("multiline", function() {
                var str = "spy\ntest";
                var spy = sinonSpy();

                spy(str);
                spy(str);
                spy(str);

                assert.equals(
                    spy.printf("%C").replace(/ at.*/g, ""),
                    "\n    spy(" + str + ")\n\n    spy(" + str + ")\n\n    spy(" + str + ")"
                );

                spy.resetHistory();

                spy("test");
                spy("spy\ntest");
                spy("spy\ntest");

                assert.equals(
                    spy.printf("%C").replace(/ at.*/g, ""),
                    "\n    spy(test)\n    spy(" + str + ")\n\n    spy(" + str + ")"
                );
            });
        });

        it("thisValues", function() {
            var spy = sinonSpy();
            spy();
            assert.equals(spy.printf("%t"), "undefined");

            spy.resetHistory();
            spy.call(true);
            assert.equals(spy.printf("%t"), "true");
        });

        it("unmatched", function() {
            var spy = sinonSpy();

            assert.equals(spy.printf("%λ"), "%λ");
        });

        it("*", function() {
            var spy = sinonSpy();

            assert.equals(
                spy.printf("%*", 1.4567, "a", true, {}, [], undefined, null),
                "1.4567, a, true, {  }, [], undefined, null"
            );
            assert.equals(spy.printf("%*", "a", "b", "c"), "a, b, c");
        });

        describe("arguments", function() {
            it("no calls", function() {
                var spy = sinonSpy();

                assert.equals(spy.printf("%D"), "");
            });

            it("single call with arguments", function() {
                var spy = sinonSpy();

                spy(1, "a", true, false, [], {}, null, undefined);

                assert.equals(
                    spy.printf("%D"),
                    "\n" +
                        color.red("1") +
                        "\n" +
                        color.red("a") +
                        "\n" +
                        color.red("true") +
                        "\n" +
                        color.red("false") +
                        "\n" +
                        color.red("[]") +
                        "\n" +
                        color.red("{  }") +
                        "\n" +
                        color.red("null") +
                        "\n" +
                        color.red("undefined")
                );
            });

            it("single call without arguments", function() {
                var spy = sinonSpy();

                spy();

                assert.equals(spy.printf("%D"), "");
            });

            it("multiple calls with arguments", function() {
                var spy = sinonSpy();

                spy(1, "a", true);
                spy(false, [], {});
                spy(null, undefined);

                assert.equals(
                    spy.printf("%D"),
                    "\nCall 1:" +
                        "\n" +
                        color.red("1") +
                        "\n" +
                        color.red("a") +
                        "\n" +
                        color.red("true") +
                        "\nCall 2:" +
                        "\n" +
                        color.red("false") +
                        "\n" +
                        color.red("[]") +
                        "\n" +
                        color.red("{  }") +
                        "\nCall 3:" +
                        "\n" +
                        color.red("null") +
                        "\n" +
                        color.red("undefined")
                );
            });

            it("multiple calls without arguments", function() {
                var spy = sinonSpy();

                spy();
                spy();
                spy();

                assert.equals(spy.printf("%D"), "\nCall 1:\nCall 2:\nCall 3:");
            });
        });
    });

    it("captures a stack trace", function() {
        var spy = sinonSpy();
        spy();
        assert.isString(spy.getCall(0).stack);
    });
});
