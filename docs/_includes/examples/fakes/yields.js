"use strict";
var sinon = require("sinon");
var fake = sinon.fake.yields("lemon pie", "key lime pie");

fake(console.log);
// lemon pie key lime pie
