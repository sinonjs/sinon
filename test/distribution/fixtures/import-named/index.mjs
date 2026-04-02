import assert from "node:assert/strict";
import sinon, { createSandbox, spy, stub, match } from "sinon";

assert.equal(typeof sinon, "object");
assert.equal(typeof createSandbox, "function");
assert.equal(typeof spy, "function");
assert.equal(typeof stub, "function");
assert.equal(typeof match, "function");

const sandbox = createSandbox();
const fn = stub().returns("ok");
assert.equal(fn(), "ok");
sandbox.restore();
