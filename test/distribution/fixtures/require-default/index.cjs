"use strict";

const assert = require("node:assert/strict");
const sinon = require("sinon");

assert.equal(typeof sinon, "object");
assert.equal(typeof sinon.spy, "function");
assert.equal(typeof sinon.stub, "function");
assert.equal(typeof sinon.fake, "function");
assert.equal(typeof sinon.createSandbox, "function");
assert.equal(typeof sinon.restore, "function");
assert.equal(typeof sinon.match, "function");
assert.equal(typeof sinon.promise, "function");
assert.equal(typeof sinon.timers, "object");
assert.equal(sinon.createSandbox.length, 1);
assert.equal(sinon.createSandbox.name, "createSandbox");

const spy = sinon.spy();
spy("a");
assert.equal(spy.callCount, 1);

const stub = sinon.stub().returns(42);
assert.equal(stub(), 42);

const sandbox = sinon.createSandbox();
const clock = sandbox.useFakeTimers();
assert.equal(typeof clock.tick, "function");
assert.equal(typeof clock.restore, "function");
clock.restore();
sandbox.restore();
