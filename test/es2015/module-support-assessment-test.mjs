/**
 * About these tests:
 * These tests concern EcmaScript Modules. That is, they test Sinon's behaviour
 * when running in a EcmaScript 2015+ environment that has the Module type.
 * They do not assert how code that has been transpiled into ES5 using Babel
 * and similar will behave.
 */
import * as aModule from "./a-module.mjs";

// Usually one would import the default module, but one can make a form of wrapper like this
/* eslint-disable no-unused-vars */
import functionModule, * as functionModuleAlternative from "./a-function-module.mjs";

import aModuleWithDefaultExport from "./a-module-with-default.mjs";
import aModuleWithToStringTag from "./a-module-with-to-string-tag.mjs";
import referee from "@sinonjs/referee";
import sinon from "../../pkg/sinon-esm.js";

const { assert, refute } = referee;

/**
 * @param action {string} the export on the `sinon` namespace to test
 */
function createTestSuite(action) {
    var stub;
    var errorRegEx = /TypeError: ES Modules cannot be (stubbed|spied)/;

    describe(`sinon.${action}()`, function () {
        afterEach(function () {
            if (stub && stub.restore) {
                stub.restore();
            }
        });

        describe("Modules with objects as their default export", function () {
            it("should NOT result in error", function () {
                refute.exception(function () {
                    stub = sinon[action](aModuleWithDefaultExport, "anExport");
                });
            });

            it("should NOT result in error with a custom toStringTag", function () {
                refute.exception(function () {
                    stub = sinon[action](aModuleWithToStringTag, "anExport");
                });
            });

            it("should spy/stub an exported function", function () {
                stub = sinon[action](aModuleWithDefaultExport, "anExport");
                aModuleWithDefaultExport.anExport();
                aModuleWithDefaultExport.anExport();
                assert(stub.callCount === 2);
            });
        });

        describe("Modules without default export", function () {
            it("should give a proper error message", function () {
                assert.exception(function () {
                    sinon[action](aModule, "anExport");
                }, errorRegEx);
            });
        });

        describe("Modules that exports a function as their default export", function () {
            it("should not be possible to spy/stub the default export using a wrapper for the exports", function () {
                assert.exception(function () {
                    stub = sinon[action](functionModuleAlternative, "default");
                }, errorRegEx);
            });
        });
    });
}

createTestSuite("stub");
createTestSuite("spy");
