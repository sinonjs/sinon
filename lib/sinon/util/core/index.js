/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

exports.wrapMethod = require("./wrap-method");

exports.create = require("./create");

exports.deepEqual = require("./deep-equal");

exports.format = require("./format");

exports.functionName = require("./function-name");

exports.functionToString = require("./function-to-string");

exports.objectKeys = require("./object-keys");

exports.getPropertyDescriptor = require("./get-property-descriptor");

exports.getConfig = require("./get-config");

exports.defaultConfig = require("./default-config");

exports.timesInWords = require("./times-in-words");

exports.calledInOrder = require("./called-in-order");

exports.orderByFirstCall = require("./order-by-first-call");

exports.walk = require("./walk");

exports.restore = require("./restore");
