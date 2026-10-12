import referee from "@sinonjs/referee";
import sinon from "../../src/sinon.js";

const { assert, refute } = referee;

describe("#1572 withArgs configuration equality", function () {
    it("keeps a literal configuration separate from a broader matcher", function () {
        const stub = sinon.stub();
        const broad = stub.withArgs(sinon.match.any).returns("old");
        const literal = stub.withArgs(1).returns("new");

        refute.same(broad, literal);
        assert.equals(stub(1), "new");
        assert.equals(stub(2), "old");
        assert.equals(broad.callCount, 2);
        assert.equals(literal.callCount, 1);
    });

    it("keeps new literal behavior separate after reset", function () {
        const stub = sinon.stub();
        stub.withArgs(sinon.match.any).returns("old");
        stub.reset();
        stub.withArgs(1).returns("new");

        assert.equals(stub(1), "new");
        assert.isUndefined(stub(2));
    });

    it("keeps nested matcher and literal configurations separate", function () {
        const stub = sinon.stub();
        const broad = stub.withArgs({ item: sinon.match.any }).returns("old");
        const literal = stub.withArgs({ item: 1 }).returns("new");

        refute.same(broad, literal);
        assert.equals(stub({ item: 1 }), "new");
        assert.equals(stub({ item: 2 }), "old");
    });

    it("keeps crossing nested patterns distinct and preserves last-match behavior", function () {
        const stub = sinon.stub();
        const first = stub
            .withArgs({ a: sinon.match.any, b: 1 })
            .returns("first");
        const second = stub
            .withArgs({ a: 2, b: sinon.match.any })
            .returns("second");

        refute.same(first, second);
        assert.equals(stub({ a: 3, b: 1 }), "first");
        assert.equals(stub({ a: 2, b: 3 }), "second");
        assert.equals(stub({ a: 2, b: 1 }), "second");
    });

    it("reuses cyclic data while retaining nested matcher identity", function () {
        const stub = sinon.stub();
        const predicate = function () {
            throw new Error("Matcher must not be evaluated against a matcher");
        };
        const matcher = sinon.match(predicate);
        const otherMatcher = sinon.match(predicate);
        const first = { item: matcher };
        const same = { item: matcher };
        const different = { item: otherMatcher };
        first.self = first;
        same.self = same;
        different.self = different;

        const fake = stub.withArgs(first);
        assert.same(stub.withArgs(same), fake);
        refute.same(stub.withArgs(different), fake);

        const raw = { item: 1 };
        const equalRaw = { item: 1 };
        raw.self = raw;
        equalRaw.self = equalRaw;
        const rawStub = sinon.stub();
        assert.same(rawStub.withArgs(raw), rawStub.withArgs(equalRaw));
    });

    it("retains predicate invocation during literal configuration", function () {
        let calls = 0;
        const stub = sinon.stub();
        const matcher = sinon.match(function () {
            calls++;
            return true;
        });
        stub.withArgs(matcher);
        assert.equals(calls, 0);
        stub.withArgs(1);
        assert.equals(calls, 1);
    });

    it("retains a predicate exception during literal configuration", function () {
        const stub = sinon.stub();
        stub.withArgs(
            sinon.match(function () {
                throw new Error("predicate failure");
            }),
        );

        assert.exception(
            function () {
                stub.withArgs(1);
            },
            { message: "predicate failure" },
        );
    });

    it("copies only matching prior calls into a new literal spy filter", function () {
        const spy = sinon.spy();
        spy(1);
        spy(2);
        const broad = spy.withArgs(sinon.match.any);
        const literal = spy.withArgs(1);

        refute.same(broad, literal);
        assert.equals(broad.callCount, 2);
        assert.equals(literal.callCount, 1);
        assert.equals(literal.firstCall.args, [1]);
        spy(2);
        assert.equals(broad.callCount, 3);
        assert.equals(literal.callCount, 1);
    });
});
