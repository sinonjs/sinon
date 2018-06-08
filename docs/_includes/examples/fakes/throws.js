"use strict";
var sinon = require("sinon");
var fake = sinon.fake.throws(new Error("not apple pie"));

fake();
// Error: not apple pie
