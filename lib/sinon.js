"use strict";
exports.spy = require("./sinon/spy");
exports.stub = require("./sinon/stub");
exports.spyCall = require("./sinon/call");
exports.mock = require("./sinon/mock");
exports.expectation = require("./sinon/expectation");
exports.collection = require("./sinon/collection");
exports.sandbox = require("./sinon/sandbox");
exports.createStubInstance = require("./sinon/create-stub-instance");
exports.match = require("./sinon/match");
var deepEqual = require("./sinon/deep-equal");
exports.match.equal = deepEqual;
var log = require("./sinon/log_error");
exports.log = log.log;
exports.logError = log.logError;
exports.restore = require("./sinon/restore");
exports.format = require("./sinon/format");

// Should probably be split out as optional addons
exports.assert = require("./sinon/assert");
exports.test = require("./sinon/test");
exports.testCase = require("./sinon/test_case");

// Should probably no longer be exposed publicly
var fn = require("./sinon/functions");
exports.wrapMethod = require("./sinon/wrap-method");
exports.deepEqual = require("./sinon/deep-equal");
exports.extend = require("./sinon/extend");
exports.functionToString = fn.toString;
exports.create = fn.create;
var config = require("./sinon/config");
exports.getConfig = config.getConfig;
exports.defaultConfig = config.defaultConfig;
exports.timesInWords = require("./sinon/times_in_words");
exports.typeOf = require("./sinon/typeOf");
