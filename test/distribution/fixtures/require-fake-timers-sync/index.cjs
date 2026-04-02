

const assert = require("node:assert/strict");
const sinon = require("sinon");

const sandbox = sinon.createSandbox();
const clock = sandbox.useFakeTimers();

assert.equal(typeof clock, "object");
assert.equal(typeof clock.tick, "function");
assert.equal(typeof clock.restore, "function");

clock.tick(5);
clock.restore();
sandbox.restore();
