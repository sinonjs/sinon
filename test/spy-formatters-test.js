"use strict";
const { D } = require("./../lib/sinon/spy-formatters");
const sinon = require("../lib/sinon");
const { assert } = require("@sinonjs/referee");

describe('formatter specifier "D"', function () {
    it("should not mutate matchers passed as arguments", function () {
        const matcher = sinon.match(function test() {
            return false;
        }, "something");
        assert.equals(matcher.message, "something");

        const stub = sinon.stub();

        stub(1, 2, 3);
        /* eslint-disable new-cap */
        D(stub, [matcher]);

        assert.equals(matcher.message, "something");
    });
});
