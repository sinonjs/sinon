import referee from "@sinonjs/referee";
import createApi from "../../src/create-sinon-api.js";

const assert = referee.assert;

describe("create-sinon-api", function () {
    it("creates a sandbox with the expected root helpers", function () {
        const sinon = createApi();

        assert.isFunction(sinon.createSandbox);
        assert.isFunction(sinon.createStubInstance);
        assert.isFunction(sinon.addBehavior);
        assert.isFunction(sinon.match);
        assert.isFunction(sinon.promise);
        assert.isObject(sinon.timers);
        assert.isFunction(sinon.restoreObject);
        assert.isFunction(sinon.expectation.create);
    });

    it("tracks created sandboxes in the root sandbox collection", function () {
        const sinon = createApi();
        const fakes = sinon.getFakes();
        const sandbox = sinon.createSandbox();

        assert.equals(fakes.indexOf(sandbox) !== -1, true);
    });

    it("tracks stub instance methods in the root sandbox collection", function () {
        const sinon = createApi();
        const fakes = sinon.getFakes();
        const before = fakes.length;
        const Class = function () {
            return;
        };
        Class.prototype.method = function () {
            return;
        };

        const stubbed = sinon.createStubInstance(Class);

        assert.equals(fakes.length > before, true);
        assert.isFunction(stubbed.method);
        assert.isFunction(stubbed.method.restore);
    });

    it("allows adding a custom behavior to stubs", function () {
        const sinon = createApi();

        sinon.addBehavior("returnsSeven", function (fake) {
            fake.returns(7);
        });

        const stub = sinon.stub().returnsSeven();
        assert.equals(stub(), 7);
    });
});
