import assert from "node:assert/strict";
import sinon, { spy, stub, createSandbox } from "sinon";

assert.equal(sinon.spy, spy);
assert.equal(sinon.stub, stub);
assert.equal(typeof createSandbox, "function");
