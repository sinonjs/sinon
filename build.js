#!/usr/bin/env node
"use strict";
/* eslint-disable local-rules/no-prototype-methods */

var fs = require("fs");
var browserify = require("browserify");
var pkg = require("./package.json");

// YYYY-MM-DD
var date = new Date().toISOString().split("T")[0];

// Keep the preamble on one line to retain source maps
var preamble = "/* Sinon.JS " + pkg.version + ", " + date + ", @license BSD-3 */";

try {
    fs.mkdirSync("pkg");
} catch (ignore) {
    // We seem to have it already
}

function makeBundle(name, config) {
    // Create a UMD wrapper and install the "sinon" global:
    config.standalone = "sinon";

    browserify("./lib/sinon.js", config).bundle(function(err, buffer) {
        if (err) {
            throw err;
        }

        var script = preamble + buffer.toString();
        fs.writeFileSync("pkg/" + name + ".js", script);
    });
}

makeBundle("sinon", {
    // Add inline source maps to the default bundle
    debug: true
});

makeBundle("sinon-no-sourcemaps", {});
