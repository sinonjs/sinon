"use strict";
var sinon = require("sinon");
var fake = sinon.fake.returns(42);

var API = {
    greet: function (name) {
        return "Hello " + name;
    }
};

sinon.replace(API, "greet", fake);

console.log(API.greet("world"));
// 42
