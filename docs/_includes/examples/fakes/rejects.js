"use strict";
var sinon = require("sinon");
var fake = sinon.fake.rejects("not cherry pie");

fake().catch(function (error) {
    console.log(error.message);
    // not cherry pie
});
