#!/usr/bin/env node
"use strict";
/* eslint-disable @sinonjs/no-prototype-methods/no-prototype-methods */
const fs = require("fs");
const browserify = require("browserify");
const pkg = require("./package.json");
const sinon = require("./lib/sinon");

// YYYY-MM-DD
const date = new Date().toISOString().split("T")[0];

// Keep the preamble on one line to retain source maps
const preamble = `/* Sinon.JS ${pkg.version}, ${date}, @license BSD-3 */`;

try {
    fs.mkdirSync("pkg");
} catch (ignore) {
    // We seem to have it already
}

const makeBundle = (entryPoint, config, done) => {
    browserify(entryPoint, config).bundle((err, buffer) => {
        if (err) {
            throw err;
        }
        done(buffer.toString());
    });
};

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
    (bundle) => {
        const script = preamble + bundle;
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
    (bundle) => {
        const script = preamble + bundle;
        fs.writeFileSync("pkg/sinon-no-sourcemaps.js", script);
    }
);

makeBundle(
    "./lib/sinon-esm.js",
    {
        // Do not detect and insert globals:
        detectGlobals: false,
    },
    (bundle) => {
        const intro = "let sinon;";
        const outro = `\nexport default sinon;\n${Object.keys(sinon)
            .map(
                (key) =>
                    `const _${key} = sinon.${key};\nexport { _${key} as ${key} };`
            )
            .join("\n")}`;

        const script = preamble + intro + bundle + outro;
        fs.writeFileSync("pkg/sinon-esm.js", script);
    }
);
