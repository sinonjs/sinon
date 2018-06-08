"use strict";
var sinon = require("sinon");
var f = sinon.fake();
var cb1 = function () {};
var cb2 = function () {};

f(1, 2, 3, cb1);
f(1, 2, 3, cb2);

console.log(f.callback === cb2);
// true
