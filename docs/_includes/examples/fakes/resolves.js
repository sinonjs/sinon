"use strict";
var sinon = require("sinon");
var fake = sinon.fake.resolves("cherry pie");

fake().then(function (value) {
    console.log(value);
    // cherry pie
});
