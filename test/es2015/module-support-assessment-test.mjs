"use strict";
import referee from "referee";
import sinon from "../../lib/sinon";
import * as aModule from "./a-module";
import aModuleWithDefaultExport from "./a-module-with-default";
import functionModule, * as functionModuleAlternative from "./a-function-module";
const {assert, refute} = referee;

function createTestSuite(action){
    var stub;
    var errorRegEx = /TypeError: ES Modules cannot be (stubbed|spied)/;

    afterEach(function() {
        stub && stub.restore && stub.restore();
    });

    describe("sinon." + action + "()", function(){
        describe("Modules with objects as their default export", function() {
    afterEach(function() {
        stub && stub.restore && stub.restore();
    });
            it("should NOT result in error", function() {
                refute.exception(function() {
                    stub = sinon[action](aModuleWithDefaultExport, "anExport");
                });
            });

            it("should spy/stub an exported function", function() {
                stub = sinon[action](aModuleWithDefaultExport, "anExport");
                aModuleWithDefaultExport.anExport();
                aModuleWithDefaultExport.anExport();
                assert(stub.callCount === 2);
            });
        });

        describe("Modules without default export", function() {
            it("should give a proper error message", function() {
                assert.exception(function() {
                    sinon[action](aModule, "anExport");
                }, errorRegEx);
            });
        });

        describe("Modules that exports a function as their default export", function() {
            it("should not be possible to spy/stub the default export using a wrapper for the exports", function() {
                assert.exception(function() {
                    stub = sinon[action](functionModuleAlternative, "anExport");
                }, errorRegEx);
            });
        });
    });
}

createTestSuite('stub');
createTestSuite('spy');
