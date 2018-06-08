"use strict";
var sinon = require("sinon");
var f = sinon.fake();
var date1 = new Date();
var date2 = new Date();

f(1, 2, date1);
f(1, 2, date2);

console.log(f.lastArg === date2);
// true
