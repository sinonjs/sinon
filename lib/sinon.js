/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var match = require("./sinon/match");

module.exports = exports = require("./sinon/util/core");

exports.assert = require("./sinon/assert");
exports.extend = require("./sinon/extend");
exports.match = match;
exports.spy = require("./sinon/spy");
exports.spyCall = require("./sinon/call");
exports.stub = require("./sinon/stub");
exports.createStubInstance = require("./sinon/stub").createStubInstance;
exports.typeOf = require("./sinon/typeOf");

/*
 * allow deepEqual to check equality of matchers through
 * dependency injectection. Otherwise we get a circular
 * dependency
 */
exports.deepEqual = exports.deepEqual.use(match);

// Modifying exports of another modules is not the right
// way to handle exports in CommonJS but this is a minimal
// change to how sinon was built before.
require("./sinon/test_case");
require("./sinon/util/fake_xdomain_request");
