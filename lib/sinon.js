/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";
module.exports = require("./sinon/util/core");

// Modifying exports of another modules is not the right
// way to handle exports in CommonJS but this is a minimal
// change to how sinon was built before.
require("./sinon/test_case");
require("./sinon/assert");
require("./sinon/util/fake_xdomain_request");
