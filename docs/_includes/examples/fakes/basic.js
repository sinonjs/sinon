"use strict";

var sinon = require("sinon");

// create a basic fake, with no behavior
var fake = sinon.fake();

fake();

console.log(fake.callCount);
// 1
