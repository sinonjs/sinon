"use strict";
import referee from "referee";
import sinon from "../../lib/sinon";
import * as aModule from "./a-module";
const {assert} = referee;

describe("Explicit lack of support for stubbing Modules", function() {
    it("should give a proper error message for modules without default export", function() {
        assert.exception(function() {
            sinon.stub(aModule, "anExport").returns(400);
        },
        /TypeError: No support for stubbing ES Modules/);
    });
});
