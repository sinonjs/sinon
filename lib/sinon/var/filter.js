"use strict";

var array = require("./array");
var call = require("./call");

module.exports = call.bind(array.filter);
