import assert from "node:assert/strict";
import sinon from "sinon";

assert.equal(typeof sinon, "object");
assert.equal(typeof sinon.spy, "function");
assert.equal(typeof sinon.stub, "function");
assert.equal(typeof sinon.createSandbox, "function");

const spy = sinon.spy();
spy();
assert.equal(spy.callCount, 1);
