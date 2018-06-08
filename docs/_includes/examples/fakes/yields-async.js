"use strict";
var sinon = require("sinon");
var fake = sinon.fake.yieldsAsync("strawberry pie");

fake(console.log);
// strawberry pie
