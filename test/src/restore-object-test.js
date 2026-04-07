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
            function () {
                restoreObject(false);
            },
            { message: "Trying to restore object but received false" },
        );

        assert.exception(
            function () {
                restoreObject(null);
            },
            { message: "Trying to restore object but received null" },
        );

        assert.exception(
            function () {
                restoreObject();
            },
            { message: "Trying to restore object but received undefined" },
        );
    });

    it("throws with no spies or stubs", function () {
        assert.exception(
            function () {
                restoreObject({
                    catpants: function () {},
                    meh: "okay",
                });
            },
            {
                message:
                    "Found no methods on object to which we could apply mutations",
            },
        );
    });

    it("works with mixed spies and stubs", function () {
        let object = {
            who: function () {},
            what: function () {},
            when: function () {},
            why: "I don't know",
        };

        sinonSpy(object, "who");
        sinonStub(object, "what");

        refute.exception(function () {
            object = restoreObject(object);
        });

        refute.isFunction(object.who.restore);
        refute.isFunction(object.what.restore);
        refute.isFunction(object.when.restore);
    });

    it("restores entire spied object", function () {
        let object = sinonSpy({
            foo: function () {},
            bar: function () {},
        });

        object = restoreObject(object);

        refute.isFunction(object.foo.restore);
        refute.isFunction(object.bar.restore);
    });

    it("restores entire stubbed object", function () {
        let object = sinonStub({
            foo: function () {},
            bar: function () {},
        });

        object = restoreObject(object);

        refute.isFunction(object.foo.restore);
        refute.isFunction(object.bar.restore);
    });
});
