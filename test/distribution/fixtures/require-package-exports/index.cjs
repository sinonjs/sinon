

const assert = require("node:assert/strict");
const sinon = require("sinon");

assert.equal(typeof sinon.restoreObject, "function");
assert.equal(typeof sinon.expectation, "object");
assert.equal(Object.prototype.hasOwnProperty.call(sinon, "timers"), true);
assert.equal(Object.prototype.hasOwnProperty.call(sinon, "promise"), true);
