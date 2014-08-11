/**
 * Sinon
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

var sinon = {
    // sinon = module.exports = require("./sinon/util/core");
    // require("./sinon/spy");
    // require("./sinon/call");
    // require("./sinon/behavior");
    // require("./sinon/stub");
    // require("./sinon/mock");
    // require("./sinon/collection");
    // require("./sinon/assert");
    // require("./sinon/sandbox");
    // require("./sinon/test");
    // require("./sinon/test_case");
    match: require("./sinon/match"),

    // is this an essential part of the api, or can we omit it?
    format: require("./sinon/format")
};

module.exports = sinon;
