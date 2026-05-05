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

    it("does not track created sandboxes in the root sandbox collection", function () {
        // Sub-sandboxes are isolated by design: pushing them into the root
        // sandbox's collection caused `sinon.restore()` to cascade-restore
        // sub-sandbox stubs (regression in 21.1.0, see #2701).
        const sinon = createApi();
        const fakes = sinon.getFakes();
        const sandbox = sinon.createSandbox();

        assert.equals(fakes.indexOf(sandbox), -1);
    });

    it("does not restore sub-sandboxes when the root sandbox is restored", function () {
        const sinon = createApi();
        const sandbox = sinon.createSandbox();
        const target = { method: () => "original" };
        sandbox.stub(target, "method").returns("stubbed");

        sinon.restore();

        assert.equals(target.method(), "stubbed");
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
