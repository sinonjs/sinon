#!/usr/bin/env node
"use strict";
/* eslint-disable @sinonjs/no-prototype-methods/no-prototype-methods */
var fs = require("fs");
var browserify = require("browserify");
var pkg = require("./package.json");
var sinon = require("./lib/sinon");

// YYYY-MM-DD
var date = new Date().toISOString().split("T")[0];

// Keep the preamble on one line to retain source maps
var preamble =
    "/* Sinon.JS " + pkg.version + ", " + date + ", @license BSD-3 */";

try {
    fs.mkdirSync("pkg");
} catch (ignore) {
    // We seem to have it already
}

function makeBundle(entryPoint, config, done) {
    browserify(entryPoint, config).bundle(function (err, buffer) {
        if (err) {
            throw err;
        }
        done(buffer.toString());
    });
}

makeBundle(
    "./lib/sinon.js",
    {
        // Add inline source maps to the default bundle
        debug: true,
        // Create a UMD wrapper and install the "sinon" global:
        standalone: "sinon",
        // Do not detect and insert globals:
        detectGlobals: false,
    },
    function (bundle) {
        var script = preamble + bundle;
        fs.writeFileSync("pkg/sinon.js", script);
    }
);

makeBundle(
    "./lib/sinon.js",
    {
        // Create a UMD wrapper and install the "sinon" global:
        standalone: "sinon",
        // Do not detect and insert globals:
        detectGlobals: false,
    },
    function (bundle) {
        var script = preamble + bundle;
        fs.writeFileSync("pkg/sinon-no-sourcemaps.js", script);
    }
);

makeBundle(
    "./lib/sinon-esm.js",
    {
        // Do not detect and insert globals:
        detectGlobals: false,
    },
    function (bundle) {
        var intro = "let sinon;";
        var outro =
            "\nexport default sinon;\n" +
            Object.keys(sinon)
                .map(function (key) {
                    return (
                        "const _" +
                        key +
                        " = sinon." +
                        key +
                        ";\nexport { _" +
                        key +
                        " as " +
                        key +
                        " };"
                    );
                })
                .join("\n");

        var script = preamble + intro + bundle + outro;
        fs.writeFileSync("pkg/sinon-esm.js", script);
    }
);
