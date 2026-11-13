/* eslint-disable no-empty-function */

import referee from "@sinonjs/referee";
import sinonSpy from "../../src/sinon/spy.js";
import sinonStub from "../../src/sinon/stub.js";
import restoreObject from "../../src/sinon/restore-object.js";
const assert = referee.assert;
const refute = referee.refute;

describe("restore-object", function () {
    it("is defined", function () {
        assert.isFunction(restoreObject);
    });

    it("throws on falsy input", function () {
        assert.exception(
            () => {
                restoreObject(false);
            },
            { message: "Trying to restore object but received false" },
        );

        assert.exception(
            () => {
                restoreObject(null);
            },
            { message: "Trying to restore object but received null" },
        );

        assert.exception(
            () => {
                restoreObject();
            },
            { message: "Trying to restore object but received undefined" },
        );
    });

    it("is a no-op with no spies or stubs", function () {
        const object = {
            catpants() {},
            meh: "okay",
        };

        refute.exception(() => {
            restoreObject(object);
        });
    });

    it("works with mixed spies and stubs", function () {
        let object = {
            who() {},
            what() {},
            when() {},
            why: "I don't know",
        };

        sinonSpy(object, "who");
        sinonStub(object, "what");

        refute.exception(() => {
            object = restoreObject(object);
        });

        refute.isFunction(object.who.restore);
        refute.isFunction(object.what.restore);
        refute.isFunction(object.when.restore);
    });

    it("restores entire spied object", function () {
        let object = sinonSpy({
            foo() {},
            bar() {},
        });

        object = restoreObject(object);

        refute.isFunction(object.foo.restore);
        refute.isFunction(object.bar.restore);
    });

    it("restores entire stubbed object", function () {
        let object = sinonStub({
            foo() {},
            bar() {},
        });

        object = restoreObject(object);

        refute.isFunction(object.foo.restore);
        refute.isFunction(object.bar.restore);
    });
});
