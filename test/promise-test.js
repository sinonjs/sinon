"use strict";

const sinon = require("../lib/sinon.js");
const { assert, refute } = require("@sinonjs/referee");

async function getPromiseStatus(promise) {
    let status = "pending";
    let value = null;
    promise
        .then(function (val) {
            status = "resolved";
            value = val;
        })
        .catch(function (reason) {
            status = "rejected";
            value = reason;
        });
    await new Promise(function (resolve) {
        setTimeout(resolve, 0);
    });
    return { status, value };
}

describe("promise", function () {
    context("with default executor", function () {
        it("returns an unresolved promise", async function () {
            const promise = sinon.promise();

            const { status, value } = await getPromiseStatus(promise);
            assert.equals(promise.toString(), "[object Promise]");
            assert.equals(status, "pending");
            assert.isNull(value);
            assert.equals(promise.status, status);
            assert.isUndefined(promise.resolvedValue);
            assert.isUndefined(promise.rejectedValue);
        });

        it("resolves the promise", async function () {
            const result = Symbol("promise result");
            const promise = sinon.promise();

            const returnValue = promise.resolve(result);

            const { status, value } = await getPromiseStatus(promise);
            assert.equals(status, "resolved");
            assert.same(value, result);
            assert.equals(promise.status, status);
            assert.same(promise.resolvedValue, result);
            assert.isUndefined(promise.rejectedValue);
            assert.same(returnValue, promise);
        });

        it("rejects the promise", async function () {
            const error = new Error("promise error");
            const promise = sinon.promise();

            const returnValue = promise.reject(error);

            const { status, value } = await getPromiseStatus(promise);
            assert.equals(status, "rejected");
            assert.same(value, error);
            assert.equals(promise.status, status);
            assert.isUndefined(promise.resolvedValue);
            assert.same(promise.rejectedValue, error);
            refute.same(returnValue, promise);
            assert.equals(returnValue.toString(), "[object Promise]");
            await assert.resolves(returnValue, undefined);
        });

        context("with resolved promise", function () {
            let promise;

            beforeEach(function () {
                promise = sinon.promise();
                promise.resolve(1);
            });

            it("fails to resolve again", function () {
                assert.exception(
                    () => {
                        promise.resolve(2);
                    },
                    {
                        name: "Error",
                        message: "Promise already resolved",
                    },
                );
            });

            it("fails to reject", function () {
                assert.exception(
                    () => {
                        promise.reject(2);
                    },
                    {
                        name: "Error",
                        message: "Promise already resolved",
                    },
                );
            });
        });

        context("with rejected promise", function () {
            let promise;

            beforeEach(function () {
                promise = sinon.promise();
                promise.reject(1);
            });

            it("fails to reject again", function () {
                assert.exception(
                    () => {
                        promise.reject(2);
                    },
                    {
                        name: "Error",
                        message: "Promise already rejected",
                    },
                );
            });

            it("fails to resolve", function () {
                assert.exception(
                    () => {
                        promise.resolve(2);
                    },
                    {
                        name: "Error",
                        message: "Promise already rejected",
                    },
                );
            });
        });
    });

    context("with custom executor", function () {
        it("accepts a fake as the custom executor", function () {
            const executor = sinon.fake();

            sinon.promise(executor);

            assert.equals(executor.callCount, 1);
            assert.equals(executor.firstCall.args.length, 2);
            assert.isFunction(executor.firstCall.firstArg);
            assert.isFunction(executor.firstCall.lastArg);
        });

        it("accepts a stub as the custom executor", function () {
            const executor = sinon.stub();

            sinon.promise(executor);

            assert.equals(executor.callCount, 1);
            assert.equals(executor.firstCall.args.length, 2);
            assert.isFunction(executor.firstCall.firstArg);
            assert.isFunction(executor.firstCall.lastArg);
        });

        it("accepts a function as the custom executor", function () {
            let args;
            function executor(resolve, reject) {
                args = [resolve, reject];
            }

            sinon.promise(executor);

            assert.equals(args.length, 2);
            assert.isFunction(args[0]);
            assert.isFunction(args[1]);
        });

        it("sets resolvedValue when custom executor resolves", async function () {
            const result = Symbol("executor result");
            function executor(resolve) {
                resolve(result);
            }

            const promise = sinon.promise(executor);

            await assert.resolves(promise, result);
            assert.equals(promise.status, "resolved");
            assert.same(promise.resolvedValue, result);
            assert.isUndefined(promise.rejectedValue);
        });

        it("sets rejectedValue when custom executor fails", async function () {
            const reason = new Error("executor failure");
            function executor(resolve, reject) {
                reject(reason);
            }

            const promise = sinon.promise(executor);

            await assert.rejects(promise, reason);
            assert.equals(promise.status, "rejected");
            assert.same(promise.rejectedValue, reason);
            assert.isUndefined(promise.resolvedValue);
        });

        it("resolves the promise", async function () {
            const result = Symbol("promise result");
            const promise = sinon.promise(sinon.fake());

            promise.resolve(result);

            await assert.resolves(promise, result);
            assert.equals(promise.status, "resolved");
            assert.same(promise.resolvedValue, result);
            assert.isUndefined(promise.rejectedValue);
        });

        it("rejects the promise", async function () {
            const error = new Error("promise error");
            const promise = sinon.promise(sinon.fake());

            promise.reject(error);

            await assert.rejects(promise, error);
            assert.equals(promise.status, "rejected");
            assert.isUndefined(promise.resolvedValue);
            assert.same(promise.rejectedValue, error);
        });
    });
});
