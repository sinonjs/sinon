(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var sinon = root.sinon || require("../lib/sinon");
    var assert = buster.assert;
    var refute = buster.refute;

    buster.testCase("sinon.log", {
        "is a function": function () {
            assert.isFunction(sinon.log);
        }
    });

    buster.testCase("sinon.logError", {
        setUp: function () {
            this.sandbox = sinon.sandbox.create();
            this.timeOutStub = this.sandbox.stub(sinon.logError, "setTimeout");
        },

        tearDown: function () {
            // setTimeout = realSetTimeout;
            this.sandbox.restore();
        },

        "is a function": function () {
            assert.isFunction(sinon.logError);
        },

        "calls sinon.log with a String": function () {
            var spy = this.sandbox.spy(sinon, "log");
            var name = "Quisque consequat, elit id suscipit.";
            var message = "Pellentesque gravida orci in tellus tristique, ac commodo nibh congue.";
            var error = new Error();

            error.name = name;
            error.message = message;

            sinon.logError("a label", error);

            assert(spy.called);
            assert(spy.calledWithMatch(name));
            assert(spy.calledWithMatch(message));
        },

        "calls sinon.log with a stack": function () {
            var spy = this.sandbox.spy(sinon, "log");
            var stack = "Integer rutrum dictum elit, posuere accumsan nisi pretium vel. Phasellus adipiscing.";
            var error = new Error();

            error.stack = stack;

            sinon.logError("another label", error);

            assert(spy.called);
            assert(spy.calledWithMatch(stack));
        },

        "should call logError.setTimeout": function () {
            var error = new Error();

            sinon.logError("some wonky label", error);

            assert(this.timeOutStub.calledOnce);
        },

        "should pass a throwing function to logError.setTimeout": function () {
            var error = new Error();

            sinon.logError("async error", error);

            var func = this.timeOutStub.args[0][0];
            assert.exception(func);
        }
    });

    buster.testCase("sinon.logError.useImmediateExceptions", {
        setUp: function () {
            this.sandbox = sinon.sandbox.create();
            this.timeOutStub = this.sandbox.stub(sinon.logError, "setTimeout");
            this.originalFlag = sinon.logError.useImmediateExceptions;
        },

        tearDown: function () {
            // setTimeout = realSetTimeout;
            this.sandbox.restore();
            sinon.logError.useImmediateExceptions = this.originalFlag;
        },

        "throws the logged error immediately, does not call logError.setTimeout when flag is true": function () {

            var error = new Error();

            sinon.logError.useImmediateExceptions = true;

            assert.exception(function () {
                sinon.logError("an error", error);
            });
            assert(this.timeOutStub.notCalled);
        },

        "does not throw logged error immediately and calls logError.setTimeout when flag is false": function () {
            var error = new Error();

            sinon.logError.useImmediateExceptions = false;

            refute.exception(function () {
                sinon.logError("an error", error);
            });
            assert(this.timeOutStub.called);
        }
    });
}(this));
