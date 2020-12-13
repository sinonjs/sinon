"use strict";

/**
 * About these tests:
 * These tests concern Typescript "commonjs" "es" Modules.
 */
var aModule = require("./ts-index");
var fooModule = require("./foo");
var fooImplModule = require("./foo-impl");

var referee = require("@sinonjs/referee");
var sinon = require("../../lib/sinon");

var assert = referee.assert;
var equals = assert.equals;

var envBackup = process.env.SINON_ES_MODULE_DETECTION;
describe("stubbing typescript", function() {
    afterEach(function() {
        process.env.SINON_ES_MODULE_DETECTION = envBackup;
        sinon.restore();
    });

    it("silently fails to stub", function() {
        process.env.SINON_ES_MODULE_DETECTION = "ignore";
        var stub = sinon.stub(fooModule, "foo");
        if (stub) {
            stub.returns("good");
        }
        // mocking has failed
        equals(aModule.main(), "REAL");
    });

    it("throws for illegal stubs", function() {
        process.env.SINON_ES_MODULE_DETECTION = "error";
        assert.exception(function() {
            sinon.stub(fooModule, "foo");
        }, /ES Module read-only property/);
    });

    it("stubs the impl correctly", function() {
        sinon.stub(fooImplModule, "foo").returns("impl");
        equals(aModule.main(), "impl");
    });
});
