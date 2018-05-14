"use strict";
var sinon = require("sinon");
var fake = sinon.fake.returns("apple pie");

console.log(fake());
// apple pie
