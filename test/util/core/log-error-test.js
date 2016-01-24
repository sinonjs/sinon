(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var sinon = root.sinon || require("../../../lib/sinon");
    var assert = buster.assert;
    var refute = buster.refute;

    buster.testCase("sinon.configureLogError", {
        setUp: function () {
            this.sandbox = sinon.sandbox.create();
            this.timeOutStub = this.sandbox.stub();
        },

        tearDown: function () {
            this.sandbox.restore();
        },

        "is a function": function () {
            var instance = sinon.configureLogError();
            assert.isFunction(instance);
        },

        "calls config.logger function with a String": function () {
            var spy = this.sandbox.spy();
            var logError = sinon.configureLogError({
                logger: spy,
                setTimeout: this.timeOutStub,
                useImmediateExceptions: false
            });
            var name = "Quisque consequat, elit id suscipit.";
            var message = "Pellentesque gravida orci in tellus tristique, ac commodo nibh congue.";
            var error = new Error();

            error.name = name;
            error.message = message;

            logError("a label", error);

            assert(spy.called);
            assert(spy.calledWithMatch(name));
            assert(spy.calledWithMatch(message));
        },

        "calls config.logger function with a stack": function () {
            var spy = this.sandbox.spy();
            var logError = sinon.configureLogError({
                logger: spy,
                setTimeout: this.timeOutStub,
                useImmediateExceptions: false
            });
            var stack = "Integer rutrum dictum elit, posuere accumsan nisi pretium vel. Phasellus adipiscing.";
            var error = new Error();

            error.stack = stack;

            logError("another label", error);

            assert(spy.called);
            assert(spy.calledWithMatch(stack));
        },

        "should call config.setTimeout": function () {
            var logError = sinon.configureLogError({
                setTimeout: this.timeOutStub,
                useImmediateExceptions: false
            });
            var error = new Error();

            logError("some wonky label", error);

            assert(this.timeOutStub.calledOnce);
        },

        "should pass a throwing function to config.setTimeout": function () {
            var logError = sinon.configureLogError({
                setTimeout: this.timeOutStub,
                useImmediateExceptions: false
            });
            var error = new Error();

            logError("async error", error);

            var func = this.timeOutStub.args[0][0];
            assert.exception(func);
        }
    });

    buster.testCase("config.useImmediateExceptions", {
        setUp: function () {
            this.sandbox = sinon.sandbox.create();
            this.timeOutStub = this.sandbox.stub();
        },

        tearDown: function () {
            this.sandbox.restore();
        },

        "throws the logged error immediately, does not call logError.setTimeout when flag is true": function () {
            var error = new Error();
            var logError = sinon.configureLogError({
                setTimeout: this.timeOutStub,
                useImmediateExceptions: true
            });

            assert.exception(function () {
                logError("an error", error);
            });
            assert(this.timeOutStub.notCalled);
        },

        "does not throw logged error immediately and calls logError.setTimeout when flag is false": function () {
            var error = new Error();
            var logError = sinon.configureLogError({
                setTimeout: this.timeOutStub,
                useImmediateExceptions: false
            });

            refute.exception(function () {
                logError("an error", error);
            });
            assert(this.timeOutStub.called);
        }
    });
}(this));
