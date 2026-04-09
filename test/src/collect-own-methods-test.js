import referee from "@sinonjs/referee";
import collectOwnMethods from "../../src/sinon/collect-own-methods.js";

const assert = referee.assert;

describe("collectOwnMethods", function () {
    it("should collect own methods with restore.sinon", function () {
        const method = function method() {
            return undefined;
        };
        method.restore = function restore() {
            return undefined;
        };
        method.restore.sinon = true;
        const obj = {
            method: method,
        };

        const methods = collectOwnMethods(obj);
        assert.equals(methods.length, 1);
        assert.same(methods[0], method);
    });

    it("should not collect inherited methods", function () {
        const method = function method() {
            return undefined;
        };
        method.restore = function restore() {
            return undefined;
        };
        method.restore.sinon = true;
        const proto = {
            method: method,
        };
        const obj = Object.create(proto);

        const methods = collectOwnMethods(obj);
        assert.equals(methods.length, 0);
    });

    it("should not collect methods without restore.sinon", function () {
        const method = function method() {
            return undefined;
        };
        const obj = {
            method: method,
        };

        const methods = collectOwnMethods(obj);
        assert.equals(methods.length, 0);
    });
});
