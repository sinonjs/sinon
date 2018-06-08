"use strict";
var sinon = require("sinon");

function double(value) {
    return 2 * value;
}

var fake = sinon.fake(double);

console.log(fake(2));
// 4

console.log("fake.calledOnce", fake.calledOnce);
// true
