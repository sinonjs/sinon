/**
 * Format functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

var type = require("type-detect");

module.exports = function typeOf(value) {
    return type(value).toLowerCase();
};
